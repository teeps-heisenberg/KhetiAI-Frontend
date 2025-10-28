import React, { useState, useRef } from "react";
import { Camera, Upload, X, Send, Image as ImageIcon, Mic, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ImageUploadWithText.css";

interface ImageUploadWithTextProps {
  onSend: (text: string, imageData?: string, audioData?: Blob) => void;
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
  const [messageMode, setMessageMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [finalRecordingTime, setFinalRecordingTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Clear previous audio chunks
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Ensure we have all chunks
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(audioBlob);
          // Save the current recording time as final time
          setFinalRecordingTime(recordingTime);
        }
        // Stop audio stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setAudioStream(null);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Request data every 100ms for more reliable chunk collection
      setIsRecording(true);
      setRecordingTime(0);
      setFinalRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(t("voice.permissionError") || "Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== 'inactive') {
      try {
        // Request all available data before stopping
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setFinalRecordingTime(0);
    audioChunksRef.current = [];
  };

  const handleSend = () => {
    if (messageMode === "text" && (text.trim() || imageData)) {
      onSend(text.trim(), imageData || undefined, undefined);
      setText("");
      setImageData("");
      setIsCaptured(false);
      onClose();
    } else if (messageMode === "voice" && (audioBlob || imageData)) {
      onSend("", imageData || undefined, audioBlob || undefined);
      setAudioBlob(null);
      setImageData("");
      setIsCaptured(false);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    if (isRecording) {
      stopRecording();
    }
    // Clean up audio stream if still active
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
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
          <h3>Upload Image with Message</h3>
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
                Use Camera
              </button>
              <button
                className={`mode-btn ${uploadMode === "upload" ? "active" : ""}`}
                onClick={() => setUploadMode("upload")}
              >
                <Upload size={18} />
                Upload File
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
                      Position your crop in the frame
                    </p>
                  </div>
                </div>
              ) : (
                <div className="upload-area" onClick={triggerFileUpload}>
                  <div className="upload-placeholder">
                    <Upload size={48} />
                    <p>Click below to select an image</p>
                    <p className="upload-hint">
                      Supports: JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="captured-image">
                <img src={imageData} alt="Captured crop" />
                <button className="retake-btn" onClick={retakePhoto}>
                  <X size={16} />
                  Retake
                </button>
              </div>
            )}
          </div>

          {/* Message Mode Toggle */}
          <div className="message-mode-selector">
            <button
              className={`message-mode-btn ${messageMode === "text" ? "active" : ""}`}
              onClick={() => {
                setMessageMode("text");
                if (isRecording) stopRecording();
              }}
            >
              <MessageSquare size={16} />
              Text Message
            </button>
            <button
              className={`message-mode-btn ${messageMode === "voice" ? "active" : ""}`}
              onClick={() => {
                setMessageMode("voice");
                setText("");
              }}
            >
              <Mic size={16} />
              Voice Message
            </button>
          </div>

          {/* Text or Voice Input */}
          {messageMode === "text" ? (
            <div className="text-input-section">
              <label className="text-input-label">
                <MessageSquare size={16} />
                Add a message (optional)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your crop or ask a question..."
                className="message-textarea"
                rows={3}
              />
            </div>
          ) : (
            <div className="voice-input-section">
              <label className="text-input-label">
                <Mic size={16} />
                Add a voice message (optional)
              </label>
              {!audioBlob ? (
                <div className="voice-recording-area">
                  {!isRecording ? (
                    <button className="start-recording-btn" onClick={startRecording}>
                      <Mic size={20} />
                      <span>Tap to record</span>
                    </button>
                  ) : (
                    <div className="recording-indicator">
                      <div className="recording-pulse"></div>
                      <span className="recording-time">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                      </span>
                      <button className="stop-recording-btn" onClick={stopRecording}>
                        Stop Recording
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="audio-preview">
                  <div className="audio-info">
                    <Mic size={16} />
                    <span>Voice message recorded ({finalRecordingTime || recordingTime}s)</span>
                  </div>
                  <button className="delete-audio-btn" onClick={deleteRecording}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="image-upload-actions">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="send-btn" 
            onClick={handleSend}
            disabled={
              messageMode === "text" 
                ? (!text.trim() && !imageData) 
                : (!audioBlob && !imageData)
            }
          >
            <Send size={16} />
            Send
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


