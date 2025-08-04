import os

# === Configure this ===
root_dir = "data/processed/train"  # change this to your dataset folder path
output_file = "classes.txt"

# === Script ===
subfolders = [name for name in os.listdir(root_dir)
              if os.path.isdir(os.path.join(root_dir, name))]

with open(output_file, "w") as f:
    for folder in sorted(subfolders):
        f.write(folder + "\n")

print(f"Done! {len(subfolders)} class names written to {output_file}")
