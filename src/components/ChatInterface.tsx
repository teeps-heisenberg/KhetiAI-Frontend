import React, { useState, useRef } from "react";
import { Bot, User, Loader2, Play, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import "./ChatInterface.css";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
  audioData?: string;
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
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleAudio = (messageId: string, audioData: string) => {
    const audio = audioRefs.current.get(messageId);
    
    if (audio) {
      if (playingAudio === messageId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        audioRefs.current.forEach((audioElement, id) => {
          if (id !== messageId) {
            audioElement.pause();
          }
        });
        audio.play();
        setPlayingAudio(messageId);
      }
    } else {
      // Create new audio element
      const newAudio = new Audio(`data:audio/mp3;base64,${audioData}`);
      newAudio.onended = () => setPlayingAudio(null);
      newAudio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingAudio(null);
      };
      audioRefs.current.set(messageId, newAudio);
      newAudio.play();
      setPlayingAudio(messageId);
    }
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
              
              {/* Display text content with markdown support */}
              <div className="message-text">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              
              {/* Display audio player if audio is available */}
              {message.audioData && (
                <div className="audio-player">
                  <button
                    className="audio-play-btn"
                    onClick={() => toggleAudio(message.id, message.audioData!)}
                    title={playingAudio === message.id ? "Pause" : "Play"}
                  >
                    {playingAudio === message.id ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                  </button>
                  <span className="audio-label">
                    {playingAudio === message.id ? t("audio.playing") || "Playing..." : t("audio.clickToPlay") || "Click to play audio"}
                  </span>
                </div>
              )}
              
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
