import torch
import torch.nn as nn
from torchvision import models

# === Load trained model ===
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 33)  # Match your 33-class setup

# Load trained weights
model.load_state_dict(torch.load("model/dermai_model_v3.pth", map_location="cpu"))
model.eval()

# === Prepare dummy input ===
dummy_input = torch.randn(1, 3, 224, 224)  # [batch_size, channels, height, width]

# === Export to ONNX ===
torch.onnx.export(
    model,
    dummy_input,
    "dermai_model_v3.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={
        "input": {0: "batch_size"},
        "output": {0: "batch_size"}
    },
    opset_version=17  # Use latest stable opset
)

print("✅ Model exported to dermai_model_v3.onnx")

# === Validate ONNX model ===
import onnx
onnx_model = onnx.load("dermai_model_v3.onnx")
onnx.checker.check_model(onnx_model)
print("✅ ONNX model is valid and ready for conversion.")
