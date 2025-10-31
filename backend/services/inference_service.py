"""
Inference Service for PlantDoc YOLOv8 Model
Handles model loading and prediction
"""

import os
import sys
from pathlib import Path
from typing import Dict, Optional
import numpy as np
from PIL import Image
import io
from ultralytics import YOLO
import asyncio
from functools import lru_cache
import cv2

class InferenceService:
    """Service for running PlantDoc YOLOv8 model inference"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the inference service
        
        Args:
            model_path: Path to the model weights file. If None, uses default path.
        """
        if model_path is None:
            # Allow override via environment variable
            env_path = os.getenv("PLANTDOC_MODEL_PATH")
            if env_path:
                model_path = Path(env_path)
            else:
                # Default path to best.pt in PlantDocTrain folder
                base_path = Path(__file__).parent.parent.parent
                model_path = base_path / "PlantDocTrain" / "runs" / "train" / "plantdoc_yolov8" / "weights" / "best.pt"
        
        self.model_path = str(model_path)
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load the YOLOv8 model from the weight file"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(
                    f"Model weights not found at {self.model_path}. "
                    f"Please ensure the model is trained and the weight file exists."
                )
            
            print(f"Loading PlantDoc model from {self.model_path}...")
            self.model = YOLO(self.model_path)
            print("Model loaded successfully!")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    async def predict(self, image_bytes: bytes) -> Optional[Dict[str, any]]:
        """
        Run prediction on an image
        
        Args:
            image_bytes: Image file as bytes
        
        Returns:
            Dictionary with prediction results:
            {
                "class_name": str,
                "confidence": float,
                "class_id": int
            }
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            # Try decoding with PIL first
            image = None
            try:
                pil_img = Image.open(io.BytesIO(image_bytes))
                if pil_img.mode != "RGB":
                    pil_img = pil_img.convert("RGB")
                image = pil_img
            except Exception:
                # Fallback to OpenCV decoding for images PIL can't identify
                try:
                    np_buf = np.frombuffer(image_bytes, dtype=np.uint8)
                    bgr = cv2.imdecode(np_buf, cv2.IMREAD_COLOR)
                    if bgr is None:
                        raise ValueError("OpenCV failed to decode image bytes")
                    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
                    image = rgb  # Ultralytics accepts numpy arrays
                except Exception as cv_err:
                    raise ValueError(f"Unable to decode image: {cv_err}")
            
            # Run inference in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None,
                lambda: self.model(image)
            )
            
            # Get prediction from first result
            result = results[0]
            
            # For classification tasks (which PlantDoc appears to be based on inference.py)
            if hasattr(result, "probs") and result.probs is not None:
                class_id = result.probs.top1
                confidence = result.probs.top1conf.item()
                class_name = self.model.names[class_id]
                
                return {
                    "class_name": class_name,
                    "confidence": confidence,
                    "class_id": class_id
                }
            else:
                # Fallback for detection tasks
                if len(result.boxes) > 0:
                    # Get most confident detection
                    box = result.boxes[0]
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    class_name = self.model.names[class_id]
                    
                    return {
                        "class_name": class_name,
                        "confidence": confidence,
                        "class_id": class_id
                    }
                else:
                    # No detections
                    return {
                        "class_name": "Unknown",
                        "confidence": 0.0,
                        "class_id": -1
                    }
                    
        except Exception as e:
            print(f"Error during prediction: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, any]:
        """Get information about the loaded model"""
        if self.model is None:
            return {"status": "not_loaded"}
        
        # Get available classes from the model
        model_classes = {}
        if hasattr(self.model, 'names'):
            model_classes = self.model.names
        
        return {
            "status": "loaded",
            "model_path": self.model_path,
            "model_type": type(self.model).__name__,
            "num_classes": len(model_classes) if model_classes else 0,
            "classes": model_classes if model_classes else {}
        }

