import React, { useState, useEffect } from "react";
import { Mic, MicOff, VolumeX } from "lucide-react";
import "./VoiceInterface.css";

interface VoiceInterfaceProps {
  onVoiceInput: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onVoiceInput,
  isListening,
  setIsListening,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // You can change this to support multiple languages

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
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

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        setIsProcessing(true);
        setTimeout(() => {
          onVoiceInput(transcript);
          setTranscript("");
          setIsProcessing(false);
        }, 500);
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
  };

  if (!isSupported) {
    return (
      <div className="voice-interface">
        <div className="voice-fallback">
          <p>
            Speech recognition not supported. Please use the text input instead.
          </p>
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
          }`}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
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
          {isProcessing ? (
            <span className="status-text processing">
              Processing your message...
            </span>
          ) : isListening ? (
            <span className="status-text listening">
              Listening... Speak now
            </span>
          ) : transcript ? (
            <span className="status-text">Tap to send: "{transcript}"</span>
          ) : (
            <span className="status-text">Tap to start voice input</span>
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
