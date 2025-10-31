"""
FastAPI Backend Server for KhetiAI
Integrates PlantDoc YOLOv8 model for crop disease detection
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import uvicorn
import os
import sys
from pathlib import Path
from datetime import datetime
import uuid
import time

# Add PlantDocTrain to path to import inference functions
sys.path.insert(0, str(Path(__file__).parent.parent / "PlantDocTrain"))

from services.inference_service import InferenceService
from services.crop_recommendations import CropRecommendationService
import numpy as _np

# Initialize FastAPI app
app = FastAPI(
    title="KhetiAI Backend API",
    description="Backend API for crop disease detection and farming advice",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
inference_service = InferenceService()
recommendation_service = CropRecommendationService()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "KhetiAI Backend",
        "version": "1.0.0"
    }

@app.get("/debug/numpy")
async def debug_numpy():
    try:
        return {
            "available": True,
            "version": getattr(_np, "__version__", None),
            "has_array_api": hasattr(_np, "array_api"),
        }
    except Exception as e:
        return {"available": False, "error": str(e)}

@app.get("/api/v1/model/classes")
async def get_model_classes():
    """Get all supported classes that the model can detect"""
    try:
        model_info = inference_service.get_model_info()
        return {
            "status": "success",
            "num_classes": model_info.get("num_classes", 0),
            "classes": model_info.get("classes", {}),
            "model_status": model_info.get("status", "unknown")
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting model classes: {str(e)}"
        )

@app.post("/api/v1/crop-analysis/analyze")
async def analyze_crop(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """
    Analyze crop image for disease detection using PlantDoc YOLOv8 model
    
    Args:
        file: Image file (JPG, PNG, etc.)
        language: Language code (en, ur)
    
    Returns:
        CropAnalysisResponse with disease detection results and recommendations
    """
    start_time = time.time()
    
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="File must be an image"
            )
        
        # Read image file
        image_bytes = await file.read()
        
        # Run inference using PlantDoc model
        prediction_result = await inference_service.predict(image_bytes)
        
        if not prediction_result:
            raise HTTPException(
                status_code=500,
                detail="Failed to process image"
            )
        
        # Get recommendations based on prediction
        recommendations = recommendation_service.get_recommendations(
            prediction_result["class_name"],
            prediction_result["confidence"],
            language
        )
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Determine health score based on confidence and whether disease is detected
        health_score = None
        disease_detected = None
        disease_confidence = None
        
        # Check if it's a disease class (contains keywords like blight, spot, rust, etc.)
        class_name_lower = prediction_result["class_name"].lower()
        is_disease = any(keyword in class_name_lower for keyword in [
            "blight", "spot", "rust", "rot", "mold", "virus", "mosaic", 
            "mildew", "scab", "bacterial"
        ])
        
        if is_disease:
            disease_detected = prediction_result["class_name"]
            disease_confidence = float(prediction_result["confidence"])
            # Health score inversely related to disease confidence
            health_score = max(0, min(100, 100 - (disease_confidence * 100)))
        else:
            # Healthy leaf
            health_score = min(100, float(prediction_result["confidence"]) * 100)
        
        # Build response
        response = {
            "id": str(uuid.uuid4()),
            "analysis_type": "plant_disease_detection",
            "health_score": round(health_score, 2) if health_score is not None else None,
            "disease_detected": disease_detected,
            "disease_confidence": round(disease_confidence, 3) if disease_confidence else None,
            "growth_stage": None,  # Can be enhanced later
            "recommendations": recommendations,
            "language": language,
            "created_at": datetime.utcnow().isoformat(),
            "processing_time": round(processing_time, 3),
            "predicted_class": prediction_result["class_name"],
            "confidence": round(prediction_result["confidence"], 3)
        }
        
        return JSONResponse(content=response)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in crop analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "KhetiAI Backend API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )

