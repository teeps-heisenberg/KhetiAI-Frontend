import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Camera, Sparkles, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import ChatInterface from "../components/ChatInterface";
import VoiceInterface from "../components/VoiceInterface";
import CameraInterface from "../components/CameraInterface";
import apiService from "../services/api";
import "./Home.css";

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      type: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);

  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: "user" | "assistant") => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    addMessage(transcript, "user");
    setIsLoading(true);

    try {
      // Send message to backend API
      const response = await apiService.sendChatMessage(
        transcript,
        i18n.language,
        "voice"
      );

      // Add AI response to chat
      addMessage(response.response, "assistant");

      // Play audio response if available
      if (response.audio_response) {
        apiService.playAudioFromBase64(response.audio_response);
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      addMessage(
        t("responses.error") || "Sorry, I couldn't process that. Please try again.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInput = async (message: string) => {
    if (!message.trim()) return;

    addMessage(message, "user");
    setIsLoading(true);

    try {
      // Send text message to backend API
      const response = await apiService.sendChatMessage(
        message,
        i18n.language,
        "text"
      );

      // Add AI response to chat
      addMessage(response.response, "assistant");
    } catch (error) {
      console.error("Error processing text input:", error);
      addMessage(
        t("responses.error") || "Sorry, I couldn't process that. Please try again.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async (imageData: string) => {
    addMessage(t("responses.analyzing"), "user");
    setIsLoading(true);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Send to backend for analysis
      const response = await apiService.analyzeCropImage(blob, i18n.language);

      // Format the response message
      const analysisMessage = `${response.recommendations}`;
      addMessage(analysisMessage, "assistant");
    } catch (error) {
      console.error("Error analyzing crop image:", error);
      addMessage(
        t("responses.error") || "Sorry, I couldn't analyze the image. Please try again.",
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>{t("home.badge")}</span>
            </div>
            <h1 className="hero-title">
              {t("home.title")}{" "}
              <span className="gradient-text">{t("home.titleHighlight")}</span>
            </h1>
            <p className="hero-description">{t("home.description")}</p>

            {/* Input Mode Selector */}
            <div className="input-mode-selector">
              <button
                className={`mode-btn ${inputMode === "voice" ? "active" : ""}`}
                onClick={() => setInputMode("voice")}
              >
                <Mic size={18} />
                {t("home.voiceFirst")}
              </button>
              <button
                className={`mode-btn ${inputMode === "text" ? "active" : ""}`}
                onClick={() => setInputMode("text")}
              >
                <MessageCircle size={18} />
                {t("home.textChat")}
              </button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="chat-section">
          <div className="chat-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">
                  <Sparkles size={48} />
                </div>
                <h3>{t("home.welcomeTitle")}</h3>
                <p>{t("home.welcomeDescription")}</p>
                <div className="quick-actions">
                  <button
                    className="quick-action-btn"
                    onClick={() => setIsCameraOpen(true)}
                  >
                    <Camera size={16} />
                    {t("home.analyzeCrop")}
                  </button>
                  <button
                    className="quick-action-btn"
                    onClick={() => setInputMode("voice")}
                  >
                    <Mic size={16} />
                    {t("home.startVoiceChat")}
                  </button>
                </div>
              </div>
            ) : (
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
              />
            )}
          </div>

          {/* Input Area */}
          <div className="input-area">
            {inputMode === "voice" ? (
              <VoiceInterface
                onVoiceInput={handleVoiceInput}
                isListening={isListening}
                setIsListening={setIsListening}
              />
            ) : (
              <div className="text-input-container">
                <input
                  type="text"
                  placeholder={t("home.textInputPlaceholder")}
                  className="text-input"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleTextInput(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button
                  className="send-btn"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      handleTextInput(input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            )}

            {/* Camera Button */}
            <button
              className="camera-btn"
              onClick={() => setIsCameraOpen(true)}
              title="Analyze crop with camera"
            >
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Camera Interface Modal */}
        {isCameraOpen && (
          <CameraInterface
            onClose={() => setIsCameraOpen(false)}
            onCapture={handleCameraCapture}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
