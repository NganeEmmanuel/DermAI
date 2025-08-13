
## **1. Receiving the request**

* **Service:** **Amazon API Gateway**
* **Role:** Acts as the public-facing entry point for your API, accepts JSON requests from mobile or CLI clients.
* **Why:** API Gateway integrates seamlessly with Lambda and supports REST or WebSocket APIs.

---

## **2. Queuing the request**

You want a system where the request is stored temporarily and **processed asynchronously** by a Lambda, ensuring one message is handled by only one processor at a time.

* **Best choice:** **Amazon SQS (Simple Queue Service)** – **NOT** SNS.

  * SNS = pub/sub broadcast (multiple consumers get the same message).
  * SQS = point-to-point queue (one consumer gets a message, then it’s removed).
* **Role:**

  * API Gateway → Lambda (simple passthrough) → SQS queue.
  * User immediately gets a “request accepted” response.
* **Why:** SQS guarantees at-least-once delivery and ensures only one Lambda processes a message at a time. It’s also serverless.

---

## **3. First processing Lambda (model inference)**

* **Service:** **AWS Lambda**
* **Role:** Triggered by SQS when a message arrives.

  * Fetch request details from the queue.
  * Run the skin lesion model (either loaded from S3 or pre-packaged in the Lambda deployment).
  * Save prediction results and status to a **database** (see step 5).
  * If description is requested, store raw predictions in a **cache** for the next Lambda.

---

## **4. Temporary cache for passing results between Lambdas**

* **Best choice:** **Amazon ElastiCache for Redis** (serverless Redis option is available)

  * Fast in-memory store.
  * Ideal for short-lived prediction data before calling OpenAI.
  * Alternatively: **S3** if you want to keep it simpler but slightly slower.

---

## **5. Second Lambda (LLM enrichment)**

* **Service:** **AWS Lambda**
* **Role:**

  * Reads prediction data from Redis/S3.
  * Calls OpenAI API for the descriptive text.
  * Updates the database with enriched results.

---

## **6. Database for storing requests, statuses, and results**

* **Best choice:** **Amazon DynamoDB**

  * Fully serverless NoSQL database.
  * Store:

    * Request ID
    * Submission timestamp
    * Status (pending, processing, completed)
    * Predictions & enriched description
* **Why:** Low-latency retrieval when user requests results.

---

## **7. Requesting results**

* **Flow:**

  * User calls API Gateway endpoint → Lambda reads from DynamoDB → returns JSON result.
  * No queue needed for this, since the response is immediate.

---

## **8. Extra considerations**

* **Status checking:** Your first Lambda should set the status in DynamoDB as soon as it starts processing, and update when done.
* **Long processing times:** If model inference is heavy, you might need to run it in AWS SageMaker instead of Lambda (still serverless, but avoids Lambda’s 15-min limit).
* **Security:** Use IAM roles for service-to-service permissions and API Gateway authentication (Cognito or API keys).

---

### **Proposed AWS Service Map**

| Step             | AWS Service                     | Purpose                              |
| ---------------- | ------------------------------- | ------------------------------------ |
| API Entry        | API Gateway                     | Receives user requests               |
| Queue            | **SQS**                         | Holds requests for async processing  |
| Model Inference  | Lambda (triggered by SQS)       | Runs the model, saves status/results |
| Temporary Cache  | ElastiCache for Redis *(or S3)* | Holds raw predictions                |
| LLM Enrichment   | Lambda                          | Calls OpenAI API, updates DB         |
| Database         | DynamoDB                        | Stores requests, statuses, results   |
| Result Retrieval | Lambda + API Gateway            | Returns stored results to user       |

---


# How it will work

## **1. Where the endpoints live**

* **In AWS serverless, your “endpoints” aren’t written as Python routes like in Flask** — API Gateway is actually the one exposing them.
* You **define the routes (paths + methods)** in API Gateway (manually or via IaC tools like AWS SAM or Terraform).
* Each route is linked to an **AWS Lambda function** (your Python code).
* That Lambda function is just a Python script with a `lambda_handler(event, context)` function — the `event` will contain the HTTP request data (body, query params, headers, etc.).

**Example:**

```python
def lambda_handler(event, context):
    body = json.loads(event['body'])
    # Your processing logic here
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Success"})
    }
```

So in short:

* **API Gateway:** defines the endpoint path `/submit` or `/result`.
* **Lambda:** processes the request.

---

## **2. Steps to build your backend logic**

Here’s the logical flow for your project based on the architecture we discussed:

### **Endpoints**

1. `/submit`

   * Trigger: API Gateway → Lambda → push message to SQS
   * Returns: `{request_id: "...", status: "pending"}`
2. `/result`

   * Trigger: API Gateway → Lambda → read from DynamoDB
   * Returns: JSON with status + prediction (and description if available)

---

### **Lambdas**

#### a. Submit Handler Lambda

* **Purpose:** Accepts request, validates JSON, generates `request_id`, pushes to SQS.
* **Flow:**

  1. Parse event body from API Gateway.
  2. Generate `request_id` (UUID).
  3. Save initial status (`pending`) in DynamoDB.
  4. Push message to SQS.
  5. Return `request_id` to the user.

#### b. Model Processing Lambda

* **Triggered by:** SQS message arrival.
* **Flow:**

  1. Get message data (including `request_id`).
  2. Load model (from S3 or bundled — see step 4 below).
  3. Run inference.
  4. Save prediction to cache (Redis/S3) and update DynamoDB with status (`completed` if no LLM step, `awaiting_description` if LLM needed).

#### c. LLM Processing Lambda

* **Triggered by:** DynamoDB Stream or scheduled job checking for `awaiting_description`.
* **Flow:**

  1. Fetch predictions from cache.
  2. Call OpenAI API.
  3. Save enriched description to DynamoDB, set status `completed`.

#### d. Result Retrieval Lambda

* **Triggered by:** `/result` API Gateway call.
* **Flow:**

  1. Lookup request\_id in DynamoDB.
  2. Return the status and data.

---

## **3. Model storage: S3 vs bundled**

* **Bundling into Lambda:**

  * Pros: Faster cold start (model already there).
  * Cons: Lambda deployment package limit = **50 MB zipped**, 250 MB unzipped — your model may exceed this.
* **S3 approach:**

  * Store model in S3. Lambda downloads it to `/tmp` (512 MB limit).
  * Slower on cold start but works for larger models.
  * You could use **Lambda Layers** for a middle ground (shared code/model for multiple Lambdas).

Given ML models can be **hundreds of MBs**, I’d suggest **S3 + caching in /tmp**. First call may be slow, but warm invocations are fine.

---

## **4. OpenAI API usage**

* **It’s paid.** There’s no free unlimited tier — only a small trial credit for new accounts.
* You’ll need an **API key** (store it in AWS Secrets Manager or an environment variable).
* You can call it like this:

```python
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

response = openai.ChatCompletion.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a medical assistant..."},
        {"role": "user", "content": f"Describe {prediction}"}
    ]
)

description = response.choices[0].message["content"]
```

---

## **5. Implementation plan**

If we follow AWS best practices:

1. **Create API Gateway endpoints** `/submit` and `/result`.
2. **Write Submit Lambda** → validates + pushes to SQS + DynamoDB status.
3. **Write Model Lambda** → triggered by SQS, loads model from S3, updates cache + DynamoDB.
4. **Write LLM Lambda** → triggered by DynamoDB Stream (status changes), calls OpenAI, updates DynamoDB.
5. **Write Result Lambda** → returns from DynamoDB.
6. Set IAM permissions for each Lambda (only access what it needs).
7. Store secrets in AWS Secrets Manager.

