#!/bin/bash

# Setup script for KhetiAI Backend

echo "🚀 Setting up KhetiAI Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Verify model weights exist
MODEL_PATH="../PlantDocTrain/runs/train/plantdoc_yolov8/weights/best.pt"
if [ -f "$MODEL_PATH" ]; then
    echo "✅ Model weights found at: $MODEL_PATH"
else
    echo "⚠️  Warning: Model weights not found at: $MODEL_PATH"
    echo "   Please ensure the PlantDoc model has been trained."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run server: python main.py"
echo "  3. Or: uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""


