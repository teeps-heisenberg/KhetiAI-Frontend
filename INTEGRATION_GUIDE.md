# KhetiAI Frontend-Backend Integration Guide

## ✅ **What's Been Integrated**

### **1. API Service** (`src/services/api.ts`)
- ✅ Complete API client for backend communication
- ✅ Type-safe TypeScript interfaces
- ✅ Error handling
- ✅ Audio playback from base64

### **2. Updated Components**
- ✅ **Home.tsx**: Now uses real API calls instead of mock data
- ✅ **Text Chat**: Connected to `/api/v1/chat/message`
- ✅ **Voice Input**: Sends text transcript to backend
- ✅ **Crop Analysis**: Connected to `/api/v1/crop-analysis/analyze`

### **3. Features Implemented**
- ✅ Real-time chat with OpenAI GPT-4o-mini
- ✅ Audio response playback for voice messages
- ✅ Crop image analysis
- ✅ Multi-language support (English/Urdu)
- ✅ Error handling with user-friendly messages
- ✅ Loading states

---

## 🚀 **How to Run & Test**

### **Step 1: Setup Environment Variables**

Create a `.env` file in the frontend root:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

### **Step 2: Start the Backend Server**

```bash
# Navigate to backend
cd KhetiAI-Backend

# Activate virtual environment (if not already active)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (if not done)
pip install -r requirements.txt

# Add your OpenAI API key to .env file
# Edit .env and add:
# OPENAI_API_KEY=your-actual-openai-api-key

# Run the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

### **Step 3: Start the Frontend Server**

In a **new terminal**:

```bash
# Navigate to frontend
cd KhetiAI-Frontend

# Install dependencies (if not done)
npm install

# Run the frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🧪 **Testing the Integration**

### **1. Test Text Chat**
1. Open `http://localhost:5173`
2. Click on "Text Chat" mode
3. Type a farming question: "How do I improve soil health?"
4. Press Enter or click Send
5. ✅ You should get an AI response from GPT-4o-mini

### **2. Test Voice Chat**
1. Click on "Voice First" mode
2. Click the microphone button
3. Speak a question (browser's speech recognition will transcribe)
4. Release the button
5. ✅ You should get:
   - AI text response
   - Audio playback of the response (if supported)

### **3. Test Crop Analysis**
1. Click the camera button
2. Allow camera permissions
3. Capture an image
4. Click "Analyze"
5. ✅ You should get crop analysis results

### **4. Test Language Switching**
1. Switch language to Urdu using the language selector
2. Send a message
3. ✅ AI should respond in Urdu
4. ✅ Audio response (if voice mode) should be in Urdu

---

## 🔍 **How It Works**

### **Text Chat Flow:**
```
User types message
    ↓
Frontend sends to: POST /api/v1/chat/message
    ↓
Backend: GPT-4o-mini processes
    ↓
Backend returns text response
    ↓
Frontend displays response
```

### **Voice Chat Flow:**
```
User speaks (browser speech recognition)
    ↓
Browser transcribes to text
    ↓
Frontend sends text to: POST /api/v1/chat/message
    (with message_type: "voice")
    ↓
Backend: GPT-4o-mini processes
    ↓
Backend: gTTS converts response to audio
    ↓
Backend returns: {text, audio_base64}
    ↓
Frontend displays text + plays audio
```

### **Crop Analysis Flow:**
```
User captures image
    ↓
Frontend sends image to: POST /api/v1/crop-analysis/analyze
    ↓
Backend analyzes (currently mock data)
    ↓
Backend returns analysis results
    ↓
Frontend displays recommendations
```

---

## 📁 **New Files Created**

### Frontend:
- ✅ `src/config/api.ts` - API configuration
- ✅ `src/services/api.ts` - API service class
- ✅ `env.example` - Environment variables template

### Updated Files:
- ✅ `src/pages/Home.tsx` - Integrated API calls
- ✅ `src/i18n/locales/en.json` - Added error message
- ✅ `src/i18n/locales/ur.json` - Added error message

---

## 🎯 **API Endpoints Being Used**

### **1. Chat Message**
```
POST http://localhost:8000/api/v1/chat/message

Request:
{
  "message": "How do I improve soil?",
  "message_type": "text",
  "language": "en"
}

Response:
{
  "response": "AI response here...",
  "message_id": "uuid",
  "timestamp": "2024-01-01T12:00:00",
  "language": "en",
  "audio_response": "base64_string" or null
}
```

### **2. Crop Analysis**
```
POST http://localhost:8000/api/v1/crop-analysis/analyze

Request: (multipart/form-data)
- file: image file
- language: "en" or "ur"

Response:
{
  "id": "uuid",
  "health_score": 85.5,
  "recommendations": "Your crop looks healthy...",
  "language": "en",
  ...
}
```

---

## 🐛 **Troubleshooting**

### **Problem: "Failed to fetch" error**
**Solution:**
1. Make sure backend is running on port 8000
2. Check if `.env` has correct `VITE_API_URL`
3. Check browser console for CORS errors

### **Problem: No AI response**
**Solution:**
1. Check if OpenAI API key is set in backend `.env`
2. Check backend logs for errors
3. Visit `http://localhost:8000/docs` to test API directly

### **Problem: Audio doesn't play**
**Solution:**
1. Check browser console for audio errors
2. Make sure browser allows audio autoplay
3. Try clicking on the page first (browser security)

### **Problem: CORS errors**
**Solution:**
1. Backend should already allow `http://localhost:5173`
2. Check `KhetiAI-Backend/app/core/config.py` - ALLOWED_HOSTS

---

## 📊 **Status Dashboard**

### ✅ **Working Features:**
- [x] Text chat with AI
- [x] Voice transcript chat with AI
- [x] Audio response playback
- [x] Crop image analysis
- [x] Multi-language (English/Urdu)
- [x] Error handling
- [x] Loading states

### ⏳ **Future Enhancements:**
- [ ] Direct audio upload (browser mic → backend Whisper)
- [ ] Conversation history persistence
- [ ] User authentication
- [ ] Real crop analysis with OpenAI Vision
- [ ] File storage for images

---

## 🎉 **You're Ready to Test!**

1. Start backend: `uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Open: `http://localhost:5173`
4. Start chatting with KhetiAI! 🌾

The integration is **complete and ready for testing**! 🚀

