import json
import os
import uuid
from datetime import datetime, timezone

import boto3

# Initialize AWS clients
dynamodb = boto3.resource("dynamodb")
sqs = boto3.client("sqs")

# Environment variables from Terraform
REQUESTS_TABLE = os.environ.get("RESULTS_TABLE", "dermaai-requests-table") # todo asl gpt about this
CLASSIFICATION_QUEUE_URL = os.environ.get("CLASSIFICATION_QUEUE_URL") # todo asl gpt about this

# DynamoDB table reference
table = dynamodb.Table(REQUESTS_TABLE)


def handler(event, context):
    """
    Lambda entry point for submitting a new classification request.
    """
    try:
        # Parse request body (works for API Gateway + direct invoke)
        if "body" in event:
            body = json.loads(event["body"])
        else:
            body = event

        # Generate a unique request ID
        request_id = str(uuid.uuid4())

        # Extract input fields
        ui_using = body.get("UI_using", "CLI")  # Default to CLI
        processing_type = body.get("Processing_type", "Single")
        model_version = body.get("Model_version", 3)
        output_format = body.get("Output_format", "json")
        images = body.get("Images", [])

        # Current timestamp in ISO8601 UTC
        timestamp = datetime.now(timezone.utc).isoformat()

        # Construct initial request item
        item = {
            "Request_Id": request_id,
            "UI_using": ui_using,
            "Processing_type": processing_type,
            "Model_version": model_version,
            "Output_format": output_format,
            "Images": images,
            "Request_state": "Pending",
            "Time": timestamp,
        }

        # Store request in DynamoDB
        table.put_item(Item=item)

        # Send message to Classification SQS queue
        sqs.send_message(
            QueueUrl=CLASSIFICATION_QUEUE_URL,
            MessageBody=json.dumps({
                "Request_Id": request_id,
                "Images": images,
                "Model_version": model_version
            })
        )

        # Return success response
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Request submitted successfully",
                "Request_Id": request_id
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
