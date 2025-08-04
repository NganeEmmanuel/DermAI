
# 📁 Image Gathering & Preprocessing Report

## 🧩 Introduction

This document describes the process of acquiring, organizing, and preprocessing the dataset used for our image classification and detection model. The goal was to collect high-quality, class-specific image samples that represent various lesion types (or relevant subject matter), clean them for uniformity, and prepare them for model training while handling issues like class imbalance and inconsistent formats.

---

## 🔍 Data Collection Process

The dataset was sourced from a mix of public repositories, medical image archives, and pre-existing annotated datasets. Some of these datasets already contained **augmented or duplicated** images, while others were **raw and unprocessed**.

### 📌 Challenges Faced During Data Gathering

1. **Class Imbalance:**
   - Some classes (e.g., benign lesions) had **700–1300 images**, while others had as few as **80–200 images**.
   - This uneven distribution threatened to bias the model during training.

2. **Augmentation Confusion:**
   - Several datasets appeared to be **pre-augmented**, leading to confusion over original vs. synthetic images.
   - There was no standard naming convention, making it hard to filter out duplicates or synthetic variants.

3. **Inconsistent Formats & Sizes:**
   - Images came in various resolutions and formats (`.jpg`, `.png`, `.jpeg`, etc.).
   - Aspect ratios and orientations varied widely, some being **tilted**, **cropped**, or **over-zoomed**.

---

## 🛠️ Preprocessing Pipeline

To prepare the dataset for deep learning tasks, a custom preprocessing script was implemented using `PIL` (Python Imaging Library). The core steps are described below.

### 🧼 Cleaning & Conversion

- **Image Format Standardization:**
  - All images were converted to **RGB** mode and saved in `.jpg` format to ensure uniform compatibility.

- **Error Handling:**
  - Corrupted or unreadable files were **automatically skipped**, and logs were kept for review.

### 📏 Resizing with Aspect-Ratio Preservation

A custom `resize_with_padding` function was applied:
- Images were resized to **224×224** (standard input size for most CNN architectures).
- The function **maintains the original aspect ratio**, adding **gray padding** (`RGB(128, 128, 128)`) to fit the target size without distortion.
  
This ensures no stretching or skewing — critical for medical or sensitive image classification.

### 🗂 Directory Structure

The dataset was organized under the following structure for modularity:

```

├── /data/
│   ├── /raw/                # original images (unprocessed)
│   │   ├── /class1/
│   │   ├── /class2/
│   │   └── ...
│   └── /processed/          # preprocessed/resized images
│       ├── /class1/
│       ├── /class2/
│       └── ...

```

### 📉 File Size Reduction

After preprocessing:
- Total size shrank from **~2.5 GB** to **~400 MB**.
- This was expected due to:
  - Image resizing
  - JPEG compression
  - Removal of metadata
- Manual inspection confirmed that **visual quality remained high**, and the images preserved critical features.

---

## 🧠 Planned Solutions to Dataset Challenges

### ✅ Upcoming Dataset Split

We will later split the preprocessed dataset into:
- **Training set (70%)**
- **Validation set (15%)**
- **Test set (15%)**

We will ensure **stratified splitting** so that each subset reflects the overall class distribution.

### ⚖️ Handling Class Imbalance

To combat the uneven number of images per class:

- **Data Augmentation (Selective):**
  - Apply rotations, flips, brightness variation **only to under-represented classes**.
  - Avoid augmenting already-augmented classes.

- **Class Weights During Training:**
  - Compute weights inversely proportional to class frequency.
  - Pass these to the loss function (e.g., `CrossEntropyLoss` in PyTorch with `weight=...`).

- **Oversampling Techniques:**
  - Use oversampling in the dataloader (e.g., `WeightedRandomSampler` in PyTorch) for rare classes.

- **Synthetic Data (Optional):**
  - Consider using **GANs or diffusion models** to generate additional synthetic samples for rare classes if traditional augmentation is insufficient.

---

## ✅ Summary

| Step                | Outcome |
|---------------------|---------|
| Total Classes       | X (Replace with actual number) |
| Raw Dataset Size    | ~2.5 GB |
| Postprocessed Size  | ~400 MB |
| Image Size          | 224×224 |
| Preprocessing Done? | ✅ Yes |
| Ready for Splitting | 🔜 Next step |

---

## 📚 References

1. Deng, J., Dong, W., Socher, R., Li, L., Li, K., & Fei-Fei, L. (2009). *ImageNet: A Large-Scale Hierarchical Image Database*. IEEE. [[Link](https://ieeexplore.ieee.org/document/5206848)]

2. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press. [[Link](https://www.deeplearningbook.org/)]

3. Microsoft Docs. *Handling class imbalance*. [[Link](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-imbalanced-data)]

4. PyTorch Documentation. *WeightedRandomSampler*. [[Link](https://pytorch.org/docs/stable/data.html#torch.utils.data.WeightedRandomSampler)]

5. Papers with Code. *Image Preprocessing Techniques*. [[Link](https://paperswithcode.com/task/image-preprocessing)]

