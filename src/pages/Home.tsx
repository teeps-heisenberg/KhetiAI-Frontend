import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Send,
  Camera,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import ChatInterface from "../components/ChatInterface";
import VoiceInterface from "../components/VoiceInterface";
import CameraInterface from "../components/CameraInterface";
import "./Home.css";

const Home: React.FC = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "Based on your crop conditions, I recommend checking the soil moisture levels. The ideal range for most crops is between 40-60%.",
        "Your crops appear healthy! I suggest monitoring for any signs of pests in the next few days.",
        "The weather forecast looks favorable for your current growth stage. Consider applying organic fertilizer this week.",
        "I notice some yellowing in the leaves. This could indicate a nutrient deficiency. Would you like me to suggest a treatment plan?",
        "Your irrigation schedule seems optimal. Keep maintaining this pattern for the next two weeks.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, "assistant");
      setIsLoading(false);
    }, 1500);
  };

  const handleTextInput = async (message: string) => {
    if (!message.trim()) return;
    await handleVoiceInput(message);
  };

  const handleCameraCapture = (imageData: string) => {
    // Handle camera capture
    console.log("Camera captured:", imageData);
    addMessage("Analyzing crop image...", "user");
    setIsLoading(true);

    setTimeout(() => {
      addMessage(
        "I can see healthy growth patterns in your crops. The leaves show good color and structure. I recommend continuing your current care routine and monitoring for any changes in the next week.",
        "assistant"
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>AI-Powered Agriculture Assistant</span>
            </div>
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">KhetiAI</span>
            </h1>
            <p className="hero-description">
              Your intelligent farming companion that helps you make data-driven
              decisions through natural voice communication and smart crop
              analysis.
            </p>

            {/* Input Mode Selector */}
            <div className="input-mode-selector">
              <button
                className={`mode-btn ${inputMode === "voice" ? "active" : ""}`}
                onClick={() => setInputMode("voice")}
              >
                <Mic size={18} />
                Voice First
              </button>
              <button
                className={`mode-btn ${inputMode === "text" ? "active" : ""}`}
                onClick={() => setInputMode("text")}
              >
                <MessageCircle size={18} />
                Text Chat
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
                <h3>Ready to help with your farming needs!</h3>
                <p>
                  Ask me about crop health, weather predictions, soil
                  conditions, or any farming question you have.
                </p>
                <div className="quick-actions">
                  <button
                    className="quick-action-btn"
                    onClick={() => setIsCameraOpen(true)}
                  >
                    <Camera size={16} />
                    Analyze Crop
                  </button>
                  <button
                    className="quick-action-btn"
                    onClick={() => setInputMode("voice")}
                  >
                    <Mic size={16} />
                    Start Voice Chat
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
                  placeholder="Ask about your crops, weather, or farming..."
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
