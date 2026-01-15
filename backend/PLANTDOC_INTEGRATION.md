# PlantDoc YOLOv8 Model Integration

## Overview

The backend now integrates the trained PlantDoc YOLOv8 model to provide instant inference on all 27 plant leaf classes from the dataset.

## Supported Classes (27 Total)

The model can detect the following classes:

### Healthy Leaves (8 classes)
1. **Apple leaf** - Healthy apple leaves
2. **Bell_pepper leaf** - Healthy bell pepper leaves
3. **Blueberry leaf** - Healthy blueberry leaves
4. **Cherry leaf** - Healthy cherry leaves
5. **Peach leaf** - Healthy peach leaves
6. **Raspberry leaf** - Healthy raspberry leaves
7. **Soyabean leaf** - Healthy soybean leaves
8. **Strawberry leaf** - Healthy strawberry leaves
9. **Tomato leaf** - Healthy tomato leaves
10. **grape leaf** - Healthy grape leaves

### Disease-Affected Leaves (17 classes)
1. **Apple Scab Leaf** - Fungal scab disease
2. **Apple rust leaf** - Rust disease
3. **Bell_pepper leaf spot** - Leaf spot disease
4. **Corn Gray leaf spot** - Gray leaf spot disease
5. **Corn leaf blight** - Blight disease
6. **Corn rust leaf** - Rust disease
7. **Potato leaf early blight** - Early blight disease
8. **Potato leaf late blight** - Late blight disease
9. **Squash Powdery mildew leaf** - Powdery mildew disease
10. **Tomato Early blight leaf** - Early blight disease
11. **Tomato Septoria leaf spot** - Septoria leaf spot disease
12. **Tomato leaf bacterial spot** - Bacterial spot disease
13. **Tomato leaf late blight** - Late blight disease
14. **Tomato leaf mosaic virus** - Mosaic virus disease
15. **Tomato leaf yellow virus** - Yellow virus disease
16. **Tomato mold leaf** - Mold disease
17. **grape leaf black rot** - Black rot disease

## How It Works

1. **Model Loading**: When the backend starts, it automatically loads the trained model weights from:
   ```
   PlantDocTrain/runs/train/plantdoc_yolov8/weights/best.pt
   ```

2. **Inference Process**:
   - User uploads an image via the frontend
   - Backend receives the image
   - Model runs inference on the image
   - Results include:
     - Predicted class name
     - Confidence score (0-1)
     - Class ID (0-26)
   
3. **Recommendations**:
   - Based on the detected class, the system provides:
     - Disease description (if applicable)
     - Specific treatment recommendations
     - Prevention measures
     - Cultural practices
   - Recommendations are available in both English and Urdu

4. **Response Format**:
   ```json
   {
     "id": "uuid",
     "analysis_type": "plant_disease_detection",
     "health_score": 85.5,
     "disease_detected": "Tomato Early blight leaf",
     "disease_confidence": 0.92,
     "predicted_class": "Tomato Early blight leaf",
     "confidence": 0.92,
     "recommendations": "Detailed recommendations...",
     "language": "en",
     "created_at": "2024-01-01T12:00:00",
     "processing_time": 1.234
   }
   ```

## Features

- ✅ **Instant Inference**: Fast predictions on any of the 27 classes
- ✅ **High Accuracy**: Uses the best trained model weights
- ✅ **Comprehensive Recommendations**: Disease-specific advice for each class
- ✅ **Multi-language Support**: English and Urdu recommendations
- ✅ **Health Score Calculation**: Automatic health score based on disease detection
- ✅ **Real-time Processing**: Async inference for non-blocking responses

## API Endpoints

### Crop Analysis
```
POST /api/v1/crop-analysis/analyze

Form Data:
- file: Image file (multipart/form-data)
- language: "en" or "ur" (default: "en")
```

### Get Model Classes
```
GET /api/v1/model/classes

Returns:
- List of all 27 supported classes
- Number of classes
- Model status
```

### Health Check
```
GET /health

Returns:
- Backend status
- Service information
```

## Testing

To test the integration:

1. Start the backend:
   ```bash
   cd backend
   source venv/bin/activate
   python main.py
   ```

2. Upload any plant leaf image from the 27 supported classes

3. Receive instant inference results with recommendations

## Model Information

- **Model Type**: YOLOv8 (Ultralytics)
- **Training Dataset**: PlantDoc dataset with 27 classes
- **Weight File**: `best.pt` (best epoch during training)
- **Total Classes**: 27
- **Input Format**: RGB images (any size, automatically resized)
- **Output Format**: Class prediction with confidence score

## Notes

- The model automatically handles image preprocessing
- Inference runs asynchronously to avoid blocking
- Recommendations are class-specific and comprehensive
- All 27 classes have detailed recommendations in English
- Key classes also have Urdu translations

