# dermaai_cli/core/inference.py
import torch
import torch.nn as nn
from torchvision.models import resnet18
from torchvision import transforms
from PIL import Image
from pathlib import Path
import os
import json

# === Preprocessing (same as training) ===
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def load_labels(labels_path: Path):
    if not labels_path.exists():
        raise FileNotFoundError(f"Labels file not found: {labels_path}")
    with open(labels_path, "r") as f:
        return [line.strip() for line in f.readlines()]


def load_model(model_path: Path, labels_path: Path):
    """Load trained ResNet18 model from .pth file"""
    class_names = load_labels(labels_path)
    num_classes = len(class_names)

    model = resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    return model, class_names


def predict_image(model, image_path: Path, class_names: list[str]):
    """Predict a single image"""
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        pred_idx = torch.argmax(probs).item()
        confidence = probs[pred_idx].item()
    return class_names[pred_idx], confidence


def run_inference(model_bundle, image_paths, mode="offline"):
    """Run inference on multiple images"""
    model, class_names = model_bundle
    results = []
    for img_path in image_paths:
        if not Path(img_path).exists():
            results.append({"image": str(img_path), "prediction": "❌ File not found", "confidence": 0})
            continue
        pred, conf = predict_image(model, img_path, class_names)
        results.append({"image": str(img_path), "prediction": pred, "confidence": round(conf, 4)})
    return results
