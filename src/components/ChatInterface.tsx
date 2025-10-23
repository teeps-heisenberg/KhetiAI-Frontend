import React from "react";
import { Bot, User, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ChatInterface.css";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imageAnalysis?: {
    health_score?: number;
    disease_detected?: string;
    growth_stage?: string;
  };
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  const { t } = useTranslation();

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-interface">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-avatar">
            {message.type === "user" ? <User size={20} /> : <Bot size={20} />}
          </div>
          <div className="message-content">
            <div className="message-bubble">
              {/* Display image if present */}
              {message.imageUrl && (
                <div className="message-image">
                  <img 
                    src={message.imageUrl} 
                    alt="Uploaded crop image" 
                    className="crop-image"
                  />
                  {message.imageAnalysis && (
                    <div className="image-analysis-badge">
                      <span className="health-score">
                        Health: {message.imageAnalysis.health_score?.toFixed(1)}%
                      </span>
                      {message.imageAnalysis.disease_detected && (
                        <span className="disease-warning">
                          Disease: {message.imageAnalysis.disease_detected}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Display text content */}
              <p>{message.content}</p>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="message assistant loading">
          <div className="message-avatar">
            <Bot size={20} />
          </div>
          <div className="message-content">
            <div className="message-bubble loading">
              <div className="typing-indicator">
                <Loader2 size={16} className="animate-spin" />
                <span>{t("chat.thinking")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
