# Base image with Python 3.9 Lambda runtime
FROM public.ecr.aws/lambda/python:3.9

# Install system dependencies for Pillow
RUN yum install -y libjpeg-turbo-devel zlib-devel

# Copy requirements and install with PyTorch CPU index
COPY requirements.txt .
RUN pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu --target "${LAMBDA_TASK_ROOT}"

# Copy your Lambda function code
COPY main.py ${LAMBDA_TASK_ROOT}

# Command for Lambda to run the handler
CMD ["main.handler"]
