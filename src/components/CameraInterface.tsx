import React, { useRef, useState } from "react";
import { Camera, X, RotateCcw, Check, Upload } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"camera" | "upload">("camera");

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(t("camera.invalidFileType") || "Please select an image file");
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(t("camera.fileTooLarge") || "File size must be less than 10MB");
        return;
      }

      // Read file and convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        setIsCaptured(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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

  // Start camera when component mounts (only if camera mode)
  React.useEffect(() => {
    if (uploadMode === "camera") {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [uploadMode]);

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <h3>{t("camera.title")}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Selection */}
        {!isCaptured && (
          <div className="upload-mode-selector">
            <button
              className={`mode-btn ${uploadMode === "camera" ? "active" : ""}`}
              onClick={() => setUploadMode("camera")}
            >
              <Camera size={18} />
              {t("camera.useCamera") || "Use Camera"}
            </button>
            <button
              className={`mode-btn ${uploadMode === "upload" ? "active" : ""}`}
              onClick={() => setUploadMode("upload")}
            >
              <Upload size={18} />
              {t("camera.uploadFile") || "Upload File"}
            </button>
          </div>
        )}

        <div className="camera-content">
          {!isCaptured ? (
            uploadMode === "camera" ? (
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
              <div className="upload-area">
                <div className="upload-placeholder">
                  <Upload size={48} />
                  <p>{t("camera.uploadInstruction") || "Click below to select an image"}</p>
                  <p className="upload-hint">
                    {t("camera.uploadHint") || "Supports: JPG, PNG, WEBP (Max 10MB)"}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="captured-image">
              <img src={capturedImage} alt="Captured crop" />
            </div>
          )}
        </div>

        <div className="camera-controls">
          {!isCaptured ? (
            uploadMode === "camera" ? (
              <button className="capture-btn" onClick={captureImage}>
                <Camera size={24} />
              </button>
            ) : (
              <button className="upload-btn" onClick={triggerFileUpload}>
                <Upload size={20} />
                {t("camera.selectFile") || "Select File"}
              </button>
            )
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default CameraInterface;
