from .invoke import invoke_lambda
from ..utils.config import LAMBDA_GET_RESULT


def get_result(request_id):
    """
    Fetch results from DynamoDB through get_result Lambda.
    """
    payload = {"pathParameters": {"request_id": request_id}}
    return invoke_lambda(LAMBDA_GET_RESULT, payload)
