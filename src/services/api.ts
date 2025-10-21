/**
 * API Service for KhetiAI Backend
 */

import API_CONFIG from '../config/api';

// Types
export interface ChatMessageRequest {
  message: string;
  message_type: 'text' | 'voice';
  language: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  message_id: string;
  timestamp: string;
  language: string;
  audio_response?: string | null;
}

export interface VoiceChatResponse {
  transcript: string;
  response: string;
  message_id: string;
  timestamp: string;
  language: string;
  audio_response: string;
}

export interface CropAnalysisResponse {
  id: string;
  analysis_type: string;
  health_score?: number;
  disease_detected?: string;
  disease_confidence?: number;
  growth_stage?: string;
  recommendations: string;
  language: string;
  created_at: string;
  processing_time: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Send text chat message
   */
  async sendChatMessage(
    message: string,
    language: string,
    messageType: 'text' | 'voice' = 'text'
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CHAT_MESSAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          message_type: messageType,
          language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Send voice message (audio file)
   */
  async sendVoiceMessage(
    audioBlob: Blob,
    language: string
  ): Promise<VoiceChatResponse> {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'audio.wav');
      formData.append('language', language);

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CHAT_VOICE}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to process voice message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending voice message:', error);
      throw error;
    }
  }

  /**
   * Analyze crop image
   */
  async analyzeCropImage(
    imageFile: Blob | File,
    language: string
  ): Promise<CropAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('file', imageFile, 'crop_image.jpg');
      formData.append('language', language);

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CROP_ANALYSIS}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to analyze crop image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing crop image:', error);
      throw error;
    }
  }

  /**
   * Play audio from base64 string
   */
  playAudioFromBase64(base64Audio: string): void {
    try {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<{ status: string; service: string; version: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`);
      
      if (!response.ok) {
        throw new Error('Backend is not responding');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking backend health:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;

