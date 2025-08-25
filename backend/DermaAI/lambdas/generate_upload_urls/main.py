import json
import os
import uuid
import boto3

s3 = boto3.client("s3")
BUCKET = os.environ["IMAGE_BUCKET"]

# Allowed content types
ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/jpg"]

def handler(event, context):
    try:
        if "body" in event:
            body = json.loads(event["body"])
        else:
            body = event

        num_files = body.get("num_files", 1)
        content_type = body.get("content_type", "image/jpeg")  # Default to JPEG

        if content_type not in ALLOWED_CONTENT_TYPES:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"Invalid content type. Allowed types: {ALLOWED_CONTENT_TYPES}"})
            }

        urls = []

        for _ in range(num_files):
            key = f"uploads/{uuid.uuid4()}.{content_type.split('/')[-1]}"
            presigned_url = s3.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": BUCKET,
                    "Key": key,
                    "ContentType": content_type  # Enforce content type
                },
                ExpiresIn=3600,  # 1 hour
            )
            urls.append({"key": key, "upload_url": presigned_url, "content_type": content_type})

        return {
            "statusCode": 200,
            "body": json.dumps({"upload_urls": urls})
        }

    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
