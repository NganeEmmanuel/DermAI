# Base image with Python 3.9 Lambda runtime
FROM public.ecr.aws/lambda/python:3.9

# Install system dependencies (optional: for Pillow, Torch, etc.)
RUN yum install -y libjpeg-turbo-devel zlib-devel

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy your Lambda function code
COPY main.py ${LAMBDA_TASK_ROOT}

# Command for Lambda to run the handler
CMD ["main.handler"]
