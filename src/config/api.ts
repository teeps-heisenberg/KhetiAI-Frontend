/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    CHAT_MESSAGE: '/api/v1/chat/message',
    CHAT_VOICE: '/api/v1/chat/voice',
    CROP_ANALYSIS: '/api/v1/crop-analysis/analyze',
    HEALTH: '/health',
  },
  TIMEOUT: 30000, // 30 seconds
};

export default API_CONFIG;

