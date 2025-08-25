import os
import json
import boto3
import torch
import torch.nn as nn
from torchvision.models import resnet18
from torchvision import transforms
from PIL import Image
import tempfile

# AWS clients
s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
sqs = boto3.client("sqs")

# Environment variables
MODEL_BUCKET = os.environ["MODEL_BUCKET"]
RESULTS_TABLE = os.environ["RESULTS_TABLE"]
OUTPUT_QUEUE = os.environ["OUTPUT_QUEUE"]

# Dynamo table reference
table = dynamodb.Table(RESULTS_TABLE)

# Preprocessing (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def load_labels_from_s3():
    """Download and load labels.txt from model bucket"""
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        s3.download_file(MODEL_BUCKET, "classes.txt", tmp.name)
        with open(tmp.name, "r") as f:
            return [line.strip() for line in f.readlines()]


def load_model_from_s3(model_version: int, num_classes: int):
    """Download model weights from S3 and load into ResNet18"""
    key = f"dermai_model_v{model_version}.pth"
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        s3.download_file(MODEL_BUCKET, key, tmp.name)
        model = resnet18(weights=None)
        model.fc = nn.Linear(model.fc.in_features, num_classes)
        model.load_state_dict(torch.load(tmp.name, map_location="cpu"))
        model.eval()
        return model


def predict_images(model, image_paths, class_names):
    """Run predictions for one or multiple images"""
    results = []
    for img_path in image_paths:
        image = Image.open(img_path).convert("RGB")
        tensor = transform(image).unsqueeze(0)  # add batch dimension
        with torch.no_grad():
            outputs = model(tensor)
            probs = torch.softmax(outputs, dim=1)[0]
            pred_idx = torch.argmax(probs).item()
            confidence = probs[pred_idx].item()
        results.append({
            "prediction": class_names[pred_idx],
            "confidence": f"{confidence:.2%}"
        })
    return results


def handler(event, context):
    try:
        # Parse SQS message
        body = json.loads(event["Records"][0]["body"])
        request_id = body["Request_Id"]
        model_version = body.get("Model_version", 3)
        image_keys = body.get("Images", [])

        # Load labels + model
        class_names = load_labels_from_s3()
        model = load_model_from_s3(model_version, len(class_names))

        # Download images from S3
        local_paths = []
        for key in image_keys:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            s3.download_file("dermaai-request-images-bucket", key, tmp.name)
            local_paths.append(tmp.name)

        # Run predictions
        predictions = predict_images(model, local_paths, class_names)

        # Update DynamoDB
        table.update_item(
            Key={"Request_Id": request_id},
            UpdateExpression="SET Request_state = :s, Predictions = :p, Model_version = :m",
            ExpressionAttributeValues={
                ":s": "Processed",
                ":p": predictions,
                ":m": model_version
            }
        )

        # Send message to description queue
        sqs.send_message(
            QueueUrl=OUTPUT_QUEUE,
            MessageBody=json.dumps({
                "Request_Id": request_id,
                "Predictions": predictions,  # to avoid repeated queries to dynamo for prediction and confidence
            })
        )

        return {"statusCode": 200, "body": json.dumps({"message": "Classification completed"})}

    except Exception as e:
        print("❌ Error:", str(e))
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
