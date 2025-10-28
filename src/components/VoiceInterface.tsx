import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./VoiceInterface.css";

interface VoiceInterfaceProps {
  onVoiceInput: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  disabled?: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onVoiceInput,
  isListening,
  setIsListening,
  disabled = false,
}) => {
  const { t, i18n } = useTranslation();
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptRef = useRef("");

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    if (disabled || isProcessing) return;
    if (!isSupported) {
      alert(t("voice.browserError"));
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    // Set language based on current locale
    recognition.lang = i18n.language === "ur" ? "ur-PK" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      transcriptRef.current = "";
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      transcriptRef.current = currentTranscript;
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Use ref to get the latest transcript value
      const finalTranscript = transcriptRef.current.trim();
      if (finalTranscript) {
        setIsProcessing(true);
        onVoiceInput(finalTranscript);
        setTranscript("");
        transcriptRef.current = "";
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setTranscript("");
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript("");
    transcriptRef.current = "";
  };

  if (!isSupported) {
    return (
      <div className="voice-interface">
        <div className="voice-fallback">
          <p>{t("voice.notSupported")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-interface">
      <div className="voice-controls">
        <button
          className={`voice-btn ${isListening ? "listening" : ""} ${
            isProcessing ? "processing" : ""
          } ${disabled ? "disabled" : ""}`}
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <VolumeX size={24} />
          ) : isListening ? (
            <MicOff size={24} />
          ) : (
            <Mic size={24} />
          )}
        </button>

        <div className="voice-status">
          {disabled ? (
            <span className="status-text disabled">
              {t("voice.waiting") || "Processing response..."}
            </span>
          ) : isProcessing ? (
            <span className="status-text processing">
              {t("voice.processing")}
            </span>
          ) : isListening ? (
            <span className="status-text listening">
              {t("voice.listening")}
            </span>
          ) : transcript ? (
            <span className="status-text">
              {t("voice.tapToSend")} "{transcript}"
            </span>
          ) : (
            <span className="status-text">{t("voice.tapToStart")}</span>
          )}
        </div>
      </div>

      {transcript && !isListening && (
        <div className="transcript-preview">
          <p>"{transcript}"</p>
        </div>
      )}
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default VoiceInterface;
