import os
import shutil
import random
from tqdm import tqdm

# Paths
BASE_DIR = '../cli/processed_sample_images'
TARGET_DIRS = ['train', 'val', 'test']
SPLIT_RATIOS = {'train': 0.7, 'val': 0.15, 'test': 0.15}


def ensure_dirs(base_path, class_names):
    for split in TARGET_DIRS:
        for cls in class_names:
            os.makedirs(os.path.join(base_path, split, cls), exist_ok=True)


def split_dataset(base_dir, ratios):
    classes = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d)) and d not in TARGET_DIRS]
    ensure_dirs(base_dir, classes)

    for cls in tqdm(classes, desc="Splitting classes"):
        class_path = os.path.join(base_dir, cls)
        images = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        random.shuffle(images)

        total = len(images)
        train_end = int(total * ratios['train'])
        val_end = train_end + int(total * ratios['val'])

        split_map = {
            'train': images[:train_end],
            'val': images[train_end:val_end],
            'test': images[val_end:]
        }

        for split, split_images in split_map.items():
            for img_name in split_images:
                src_path = os.path.join(class_path, img_name)
                dest_path = os.path.join(base_dir, split, cls, img_name)
                shutil.copy2(src_path, dest_path)

    print("✅ Dataset splitting complete.")


if __name__ == "__main__":
    split_dataset(BASE_DIR, SPLIT_RATIOS)
