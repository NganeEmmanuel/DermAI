import json
import uuid
from .invoke import invoke_lambda
from ..utils.config import LAMBDA_SUBMIT


def submit_request(images, ui="CLI", processing_type="Single", model_version=3, output_format="json"):
    """
    Submit a new request to the submit_request Lambda.
    """
    request_id = str(uuid.uuid4())

    payload = {
        "body": json.dumps({
            "Request_Id": request_id,
            "UI_using": ui,
            "Processing_type": processing_type,
            "Model_version": model_version,
            "Output_format": output_format,
            "Images": images
        })
    }

    return invoke_lambda(LAMBDA_SUBMIT, payload)
