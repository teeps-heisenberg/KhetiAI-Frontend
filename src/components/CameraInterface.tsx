import React, { useRef, useState } from "react";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./CameraInterface.css";

interface CameraInterfaceProps {
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({
  onClose,
  onCapture,
}) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(t("camera.permissionError"));
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        setIsCaptured(true);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setIsCaptured(false);
    setCapturedImage("");
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Start camera when component mounts
  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <h3>{t("camera.title")}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="camera-content">
          {!isCaptured ? (
            <div className="camera-preview">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              <div className="camera-overlay">
                <div className="focus-frame">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                <p className="capture-instruction">{t("camera.instruction")}</p>
              </div>
            </div>
          ) : (
            <div className="captured-image">
              <img src={capturedImage} alt="Captured crop" />
            </div>
          )}
        </div>

        <div className="camera-controls">
          {!isCaptured ? (
            <button className="capture-btn" onClick={captureImage}>
              <Camera size={24} />
            </button>
          ) : (
            <div className="capture-actions">
              <button className="retake-btn" onClick={retakePhoto}>
                <RotateCcw size={20} />
                {t("camera.retake")}
              </button>
              <button className="confirm-btn" onClick={confirmCapture}>
                <Check size={20} />
                {t("camera.analyze")}
              </button>
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default CameraInterface;
