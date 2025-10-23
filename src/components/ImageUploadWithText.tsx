import React, { useState, useRef } from "react";
import { Camera, Upload, X, Send, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ImageUploadWithText.css";

interface ImageUploadWithTextProps {
  onSend: (text: string, imageData?: string) => void;
  onClose: () => void;
}

const ImageUploadWithText: React.FC<ImageUploadWithTextProps> = ({
  onSend,
  onClose,
}) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"camera" | "upload">("upload");
  const [isCaptured, setIsCaptured] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
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
        setImageData(imageData);
        setIsCaptured(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const retakePhoto = () => {
    setIsCaptured(false);
    setImageData("");
    if (uploadMode === "camera") {
      startCamera();
    }
  };

  const handleSend = () => {
    if (text.trim() || imageData) {
      onSend(text.trim(), imageData || undefined);
      setText("");
      setImageData("");
      setIsCaptured(false);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Start camera when switching to camera mode
  React.useEffect(() => {
    if (uploadMode === "camera" && !isCaptured) {
      startCamera();
    } else if (uploadMode === "upload") {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [uploadMode]);

  return (
    <div className="image-upload-modal-overlay">
      <div className="image-upload-modal">
        <div className="image-upload-header">
          <h3>{t("imageUpload.title") || "Upload Image with Message"}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="image-upload-content">
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

          {/* Image Capture/Upload Area */}
          <div className="image-capture-area">
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
                    <p className="capture-instruction">
                      {t("camera.instruction") || "Position your crop in the frame"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="upload-area" onClick={triggerFileUpload}>
                  <div className="upload-placeholder">
                    <Upload size={48} />
                    <p>{t("camera.uploadInstruction") || "Click to select an image"}</p>
                    <p className="upload-hint">
                      {t("camera.uploadHint") || "Supports: JPG, PNG, WEBP (Max 10MB)"}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="captured-image">
                <img src={imageData} alt="Captured crop" />
                <button className="retake-btn" onClick={retakePhoto}>
                  <X size={16} />
                  {t("camera.retake") || "Retake"}
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="text-input-section">
            <label className="text-input-label">
              <ImageIcon size={16} />
              {t("imageUpload.messageLabel") || "Add a message (optional)"}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("imageUpload.messagePlaceholder") || "Describe your crop or ask a question..."}
              className="message-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="image-upload-actions">
          <button className="cancel-btn" onClick={handleClose}>
            {t("common.cancel") || "Cancel"}
          </button>
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={!text.trim() && !imageData}
          >
            <Send size={16} />
            {t("imageUpload.send") || "Send"}
          </button>
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

export default ImageUploadWithText;


