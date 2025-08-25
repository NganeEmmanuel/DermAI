import json
import os
import boto3

dynamodb = boto3.resource("dynamodb")

# Environment variable from Terraform
REQUESTS_TABLE = os.environ.get("RESULTS_TABLE", "dermaai-requests-table")
table = dynamodb.Table(REQUESTS_TABLE)


def handler(event, context):
    """
    Lambda entry point for fetching results from DynamoDB.
    """
    try:
        # Get request_id from API Gateway pathParameters or direct event
        if "pathParameters" in event and event["pathParameters"]:
            request_id = event["pathParameters"].get("request_id")
        else:
            request_id = event.get("Request_Id")

        if not request_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing Request_Id"})
            }

        # Query DynamoDB
        response = table.get_item(Key={"Request_Id": request_id})

        if "Item" not in response:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Request not found"})
            }

        return {
            "statusCode": 200,
            "body": json.dumps(response["Item"])
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
