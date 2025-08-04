

### 📊 EDA\_Report.md

#### **1. Overview**

This EDA phase focused on understanding the skin lesion dataset post-preprocessing. The dataset consists of 30 distinct classes of skin conditions. Each class contains images split into `train`, `validation`, and `test` sets. Visual samples and class distributions were explored to assess the dataset's quality and identify potential issues.

---

#### **2. Goals of EDA**

* Understand class distributions across the dataset splits.
* Visually inspect samples to ensure data quality and correctness.
* Validate image sizes and uniformity post-resizing.
* Identify early data imbalance and plan mitigation.

---

#### **3. Dataset Structure**

```bash
data/
└── processed/
    ├── train/
    ├── val/
    └── test/
```

Each subdirectory contains 30 folders representing distinct disease classes, e.g., `Acne`, `Eczema`, `Melanoma`, etc.

---

#### **4. Findings**

##### ✅ **Image Dimension Consistency**

All images were resized with padding to `(224, 224)` pixels using `PIL.Image.Resampling.LANCZOS`. This ensures compatibility with most pretrained CNN architectures like ResNet, EfficientNet, etc.

```
Sample Image Sizes:
 - Mean size: (224.0, 224.0)
 - Min size: (224, 224)
 - Max size: (224, 224)
```

> 🔍 *Conclusion:* Image dimensions are consistent, no need for resizing during model training, thus reducing on-the-fly processing time.

---

##### 📊 **Class Distribution**

The class distribution plot shows **high variability** in the number of images per class. For example:

* Some classes like `Acne` and `Rash_Dermatitis` have >1500 images.
* Others like `Herpes`, `Neurofibromatosis`, and `Larva_Migrans` have <150 images.

![Class Distribution](./assets/class_distribution.png)

> 🟠 *Observation:* Class imbalance is significant, and model bias toward majority classes is a likely risk.

---

##### 🖼️ **Sample Visual Inspection**

Representative image samples from each class were displayed from the training set (e.g., Acne, Athlete\_foot, Actinic\_Keratosis, etc.).

Highlights:

* Images are visibly diverse in skin tone, lighting, focus, and condition severity.
* Watermarks are present on some images (e.g., “Dermnet”), which may act as confounding features if not handled properly.

> 🟢 *Conclusion:* Visual quality is acceptable, and the class examples appear correct. However, watermark artifacts should be considered when training models.

---

#### **5. Challenges Identified**

| Issue                      | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| Data Imbalance             | Some classes have up to 20x more images than others               |
| Augmented Data Variability | Augmentations help, but may still lack true visual diversity      |
| Watermark Artifacts        | Could mislead model into associating non-disease features         |
| Inconsistent Sources       | Merged datasets from various sources may carry hidden domain bias |

---

#### **6. Solutions and Next Steps**

##### 🛠️ **Handling Class Imbalance**

* Apply **weighted loss functions** (e.g., `CrossEntropyLoss(weight=class_weights)`) to penalize overrepresented classes less.
* Use **data sampling strategies**:

  * `WeightedRandomSampler` to oversample minority classes.
  * Optionally, use SMOTE/augmentation techniques where appropriate.

##### 🧪 **Data Split Strategy**

Your current split seems well-structured:

* Approx. 70% Train
* 15% Validation
* 15% Test

We will use this split for model training and evaluation, ensuring stratification is maintained if classes are further rebalanced.

##### 🧼 **Preprocessing Enhancements**

* Optionally blur watermarks or mask them in pre-processing.
* Normalize pixel intensities across images for consistent model input.

##### 📦 **Modeling Considerations**

* Use **Transfer Learning** with pretrained CNNs (e.g., EfficientNetB0).
* Integrate **early stopping** and **focal loss** if class imbalance proves too severe.

---

#### **7. Conclusion**

This EDA confirms that the dataset is ready for modeling but will require mitigation for class imbalance. The dataset’s visual integrity is preserved after resizing, and structure is suitable for training deep learning models. Next steps involve training, evaluating, and iteratively improving the model while carefully tracking performance across underrepresented classes.

---

#### **8. References**

* [PIL.Image.Resampling Documentation](https://pillow.readthedocs.io/en/stable/releasenotes/7.0.0.html#image-resampling)
* [tqdm progress bar](https://tqdm.github.io/)
* [Class Imbalance Strategies in Deep Learning](https://arxiv.org/abs/2007.09518)
* [Skin Disease Datasets - Kaggle](https://www.kaggle.com/search?q=skin+disease+dataset)

