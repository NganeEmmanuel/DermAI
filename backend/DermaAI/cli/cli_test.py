import argparse
import torch
import torch.nn as nn
from torchvision import models, transforms
from torchvision.models import resnet18, ResNet18_Weights
from PIL import Image
import os

# === Preprocessing (same as training) ===
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# === Load class labels ===
def load_labels(path='classes.txt'):
    with open(path, 'r') as f:
        return [line.strip() for line in f.readlines()]

# === Load model ===
def load_model(model_path, num_classes):
    model = resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location='cpu'))
    model.eval()
    return model

# === Predict single image ===
def predict_image(model, image_path, class_names):
    image = Image.open(image_path).convert('RGB')
    input_tensor = transform(image).unsqueeze(0)  # Add batch dim
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        pred_idx = torch.argmax(probs).item()
        confidence = probs[pred_idx].item()
    return class_names[pred_idx], confidence

# === CLI Entry Point ===
def main():
    parser = argparse.ArgumentParser(description="CLI Tool to test ResNet18 models on images.")
    parser.add_argument("images", nargs='+', help="Path(s) to input image(s)")
    parser.add_argument("--model", required=True, help="Path to the trained .pth model")
    parser.add_argument("--labels", default="classes.txt", help="Path to labels.txt file")
    args = parser.parse_args()

    class_names = load_labels(args.labels)
    model = load_model(args.model, num_classes=len(class_names))

    for img_path in args.images:
        if not os.path.isfile(img_path):
            print(f"❌ File not found: {img_path}")
            continue
        label, conf = predict_image(model, img_path, class_names)
        print(f"🖼️ {os.path.basename(img_path)} → 📌 Prediction: {label} ({conf:.2%} confidence)")

if __name__ == "__main__":
    main()
