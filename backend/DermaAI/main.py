from preprocessing.image_resizer import preprocess_images

if __name__ == "__main__":
    RAW_DIR = "cli/raw_sample_images"
    PROCESSED_DIR = "cli/processed_sample_images"
    TARGET_SIZE = (224, 224)

    print("[INFO] Starting image preprocessing...")
    preprocess_images(RAW_DIR, PROCESSED_DIR, desired_size=TARGET_SIZE)
    print("[INFO] Preprocessing complete. Check the 'data/processed' folder.")
