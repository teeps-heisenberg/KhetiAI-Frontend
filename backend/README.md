# KhetiAI Backend

FastAPI backend server for crop disease detection using PlantDoc YOLOv8 model.

## Features

- ✅ Crop disease detection using trained PlantDoc YOLOv8 model
- ✅ RESTful API endpoints
- ✅ Multi-language support (English/Urdu)
- ✅ Disease-specific recommendations
- ✅ CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not exists)
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Verify Model Weights

Ensure the PlantDoc model weights file exists at:
```
PlantDocTrain/runs/train/plantdoc_yolov8/weights/best.pt
```

If the weights file is in a different location, you can specify it in the `InferenceService` initialization.

### 3. Run the Server

```bash
# From the backend directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at:
- API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

## API Endpoints

### Health Check
```
GET /health
```

### Crop Analysis
```
POST /api/v1/crop-analysis/analyze

Form Data:
- file: Image file (multipart/form-data)
- language: Language code (en, ur)

Response:
{
  "id": "uuid",
  "analysis_type": "plant_disease_detection",
  "health_score": 85.5,
  "disease_detected": "Tomato Early blight leaf",
  "disease_confidence": 0.92,
  "recommendations": "...",
  "language": "en",
  "created_at": "2024-01-01T12:00:00",
  "processing_time": 1.234
}
```

## Model Information

The backend uses the PlantDoc YOLOv8 model trained on the PlantDoc dataset, which can detect:
- 32 different plant leaf classes
- Various diseases: blight, spot, rust, rot, mold, virus, etc.
- Healthy leaf conditions

## Troubleshooting

### Model Not Found Error
- Ensure `best.pt` exists in `PlantDocTrain/runs/train/plantdoc_yolov8/weights/`
- Check that the path is correct in `inference_service.py`

### CUDA/GPU Issues
- The model will automatically use CPU if CUDA is not available
- For GPU support, ensure PyTorch with CUDA is installed

### Memory Issues
- Large models may require significant RAM
- Consider using a GPU for faster inference
- Reduce image size if needed

## Development

The backend is structured as:
```
backend/
├── main.py                 # FastAPI app and endpoints
├── services/
│   ├── inference_service.py    # Model loading and prediction
│   └── crop_recommendations.py # Disease recommendations
└── requirements.txt        # Python dependencies
```


