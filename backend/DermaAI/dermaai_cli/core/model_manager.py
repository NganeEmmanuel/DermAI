# dermaai_cli/core/model_manager.py
import json
import requests
from pathlib import Path
import shutil
import datetime
from tqdm import tqdm

# Where models are stored locally for all machines
MODELS_DIR = Path.home() / ".dermai" / "models"
INDEX_FILE = MODELS_DIR / "model_index.json"

# Where local dev models live for testing
LOCAL_DEV_MODELS_DIR = Path(__file__).parents[2] / "model"
S3_BASE_URL = "https://dermaai-model-classes-bucket.s3.amazonaws.com"

print(LOCAL_DEV_MODELS_DIR)



# -------------------------------
# Index helpers
# -------------------------------
def _load_index():
    if not INDEX_FILE.exists():
        return {"installed_models": []}
    with open(INDEX_FILE, "r") as f:
        return json.load(f)


def _save_index(index):
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    with open(INDEX_FILE, "w") as f:
        json.dump(index, f, indent=2)


# -------------------------------
# Model registry
# -------------------------------
def list_models():
    index = _load_index()
    return index.get("installed_models", [])


def add_model(version: int, path: str, metadata: dict):
    index = _load_index()
    if not any(m["version"] == version for m in index["installed_models"]):
        index["installed_models"].append({
            "version": version,
            "path": str(path),
            "metadata": metadata
        })
        _save_index(index)


# -------------------------------
# Model management
# -------------------------------
def download_model(version: int):
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODELS_DIR / f"dermai_model_v{version}.pth"
    labels_path = MODELS_DIR / f"classes_v{version}.txt"

    # Public URLs
    model_url = f"{S3_BASE_URL}/dermai_model_v{version}.pth"
    print(f"Downloading model v{version} from S3...")

    # Download model with progress
    try:
        with requests.get(model_url, stream=True) as r:
            r.raise_for_status()
            total_size = int(r.headers.get('content-length', 0))
            chunk_size = 8192
            with open(model_path, "wb") as f, tqdm(
                total=total_size, unit='B', unit_scale=True, desc="Model"
            ) as progress:
                for chunk in r.iter_content(chunk_size=chunk_size):
                    f.write(chunk)
                    progress.update(len(chunk))

        # Download classes file (usually small, so no progress needed)
        r = requests.get(f"{S3_BASE_URL}/classes_v{version}.txt")
        r.raise_for_status()
        labels_path.write_text(r.text)

    except Exception as e:
        raise RuntimeError(f"Failed to download model from S3 URL: {e}")

    # Generate metadata
    classes = [line.strip() for line in labels_path.read_text().splitlines() if line.strip()]
    metadata = {
        "version": version,
        "num_classes": len(classes),
        "classes_file": str(labels_path),
        "train_date": "2025-08-25",
        "accuracy": 0.75
    }

    add_model(version, model_path, metadata)
    return model_path, labels_path


def ensure_model_exists(version: int, local_dev=False):
    model_filename = f"dermai_model_v{version}.pth"
    classes_filename = f"classes_v{version}.txt"

    model_path = MODELS_DIR / model_filename
    classes_path = MODELS_DIR / classes_filename

    # print(f"[DEBUG] MODELS_DIR = {MODELS_DIR}")
    # print(f"[DEBUG] LOCAL_DEV_MODELS_DIR = {LOCAL_DEV_MODELS_DIR}")
    # print(f"[DEBUG] Checking for local dev files...")

    if local_dev:
        source_model = LOCAL_DEV_MODELS_DIR / model_filename
        source_classes = LOCAL_DEV_MODELS_DIR / classes_filename
        # print(f"[DEBUG] Looking for model at: {source_model}")
        # print(f"[DEBUG] Looking for classes at: {source_classes}")
        if source_model.exists() and source_classes.exists():
            # print("[DEBUG] Found local dev files. Copying to MODELS_DIR...")
            shutil.copy(source_model, model_path)
            shutil.copy(source_classes, classes_path)
            metadata = {
                "version": version,
                "num_classes": len(classes_path.read_text().splitlines()),
                "classes_file": str(classes_path),
                "train_date": datetime.date(2025, 8, 25).isoformat(),
                "accuracy": 0.75
            }
            add_model(version, model_path, metadata)
            # print(f"[DEBUG] Model v{version} installed successfully from local dev files.")
            return model_path, classes_path
        else:
            print("[DEBUG] Local dev files NOT found.")

    # fallback to download if files don't exist
    if not model_path.exists() or not classes_path.exists():
        print("[DEBUG] Model or classes not found in MODELS_DIR. Downloading...")
        return download_model(version)

    # Ensure metadata exists in index
    metadata = {
        "version": version,
        "num_classes": len(classes_path.read_text().splitlines()),
        "classes_file": str(classes_path),
        "train_date": datetime.date(2025, 8, 25).isoformat(),
        "accuracy": 0.75
    }
    add_model(version, model_path, metadata)
    print(f"[DEBUG] Model v{version} already exists in MODELS_DIR.")
    return model_path, classes_path


def get_model_info(version: int):
    """
    Returns full metadata for a model, reading the classes file for an accurate num_classes.
    """
    models = list_models()
    for m in models:
        if m["version"] != version:
            continue

        model_path = Path(m["path"])
        metadata = m.get("metadata", {})

        # Classes file path from metadata or default
        classes_file = Path(metadata.get("classes_file", model_path.parent / f"classes_v{version}.txt"))

        # Read actual classes from file
        try:
            classes = [line.strip() for line in classes_file.read_text().splitlines() if line.strip()]
            metadata["num_classes"] = len(classes)
        except Exception:
            classes = []
            metadata["num_classes"] = "?"

        # Always include full path info
        info = {
            "version": version,
            "path": str(model_path),
            "metadata": metadata,
            "classes": classes,  # full list if needed
        }
        return info

    raise ValueError(f"Model v{version} not found")

