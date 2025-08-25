import boto3
import json
from ..utils.config import AWS_REGION

lambda_client = boto3.client("lambda", region_name=AWS_REGION)

def invoke_lambda(function_name, payload):
    """
    Invokes a Lambda function with the given payload.
    """
    response = lambda_client.invoke(
        FunctionName=function_name,
        InvocationType="RequestResponse",
        Payload=json.dumps(payload)
    )

    result = response["Payload"].read().decode("utf-8")
    return json.loads(result)
