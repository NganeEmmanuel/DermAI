import os
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

def resize_with_padding(image, desired_size=(224, 224), fill_color=(128, 128, 128)):
    old_size = image.size  # (width, height)
    ratio = min(desired_size[0] / old_size[0], desired_size[1] / old_size[1])
    new_size = tuple([int(x * ratio) for x in old_size])
    image = image.resize(new_size, Image.Resampling.LANCZOS)

    new_img = Image.new("RGB", desired_size, fill_color)
    paste_position = ((desired_size[0] - new_size[0]) // 2,
                      (desired_size[1] - new_size[1]) // 2)
    new_img.paste(image, paste_position)

    return new_img

def preprocess_images(input_root, output_root, desired_size=(224, 224)):
    """
    Walks through the input_root directory and processes images,
    saving them to a mirrored structure in output_root with .jpg extension.
    """
    for subdir, _, files in os.walk(input_root):
        relative_path = os.path.relpath(subdir, input_root)
        output_dir = os.path.join(output_root, relative_path)
        os.makedirs(output_dir, exist_ok=True)

        image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

        for file_name in image_files:
            input_path = os.path.join(subdir, file_name)
            base_name = os.path.splitext(file_name)[0]
            output_path = os.path.join(output_dir, base_name + ".jpg")  # Save all as JPG

            try:
                with Image.open(input_path) as img:
                    img = img.convert("RGB")  # Ensure 3 channels
                    resized_img = resize_with_padding(img, desired_size)
                    resized_img.save(output_path, format="JPEG", quality=95)
                    logging.info(f"Processed: {input_path} -> {output_path}")
            except Exception as e:
                logging.error(f"Failed: {input_path} | Reason: {e}")

# if __name__ == "__main__":
#     preprocess_images("data/raw", "data/processed", desired_size=(224, 224))
