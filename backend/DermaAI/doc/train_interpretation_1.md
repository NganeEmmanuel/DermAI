## 📊 Model Training Summary Report – ResNet18 (10 Epochs)

### 🔧 Configuration

* **Model**: ResNet18
* **Epochs**: 10
* **Dataset**: Custom Skin Lesion Dataset
* **Loss Function**: CrossEntropyLoss
* **Optimizer**: Adam / SGD *(assumed default)*
* **Augmentation**: Standard *(assumed)*
* **Pretrained**: ❌ *(training from scratch)*

---

### 📈 Epoch-wise Performance

| Epoch | Train Loss | Train Acc (%) | Val Loss | Val Acc (%) | Observations                                                   |
| ----- | ---------- | ------------- | -------- | ----------- | -------------------------------------------------------------- |
| 1     | 2.1054     | 38.73         | 1.6715   | 49.00       | Learning begins; high loss, but non-random accuracy.           |
| 2     | 1.4010     | 52.21         | 1.5110   | 53.34       | Significant drop in training loss and improvement in accuracy. |
| 3     | 1.2305     | 55.05         | 1.3572   | 57.45       | Steady improvement; generalization increasing.                 |
| 4     | 1.1295     | 57.39         | 1.3007   | 58.65       | Good progression; model stabilizing.                           |
| 5     | 1.0586     | 59.30         | 1.3523   | 55.74       | Minor overfitting hint; validation accuracy dips.              |
| 6     | 1.0101     | 60.35         | 1.2822   | 58.20       | Recovering on validation; slight regular improvement.          |
| 7     | 0.9736     | 61.04         | 1.2525   | 59.78       | Both train/val improve; learning stabilizes.                   |
| 8     | 0.9392     | 61.60         | 1.2500   | 60.05       | Plateau approaching; validation accuracy flattens.             |
| 9     | 0.9243     | 62.19         | 1.2846   | 58.08       | Slight overfitting again; model consistency needed.            |
| 10    | 0.9050     | 62.49         | 1.2538   | 59.54       | Final model shows steady state; early saturation.              |

---

### 📌 Key Insights

* ✅ **Learning Trend**: Strong early learning, plateau around epoch 7–10.
* ⚖️ **Overfitting Risk**: Small gap between train and val accuracy in later epochs — mild overfitting.
* 📉 **Loss Behavior**: Smooth decrease in training loss, with validation loss stabilizing after epoch 6.
* 📈 **Best Val Accuracy**: **60.05%** (Epoch 8)

---

### 🧠 Recommendations

1. **Use a pretrained ResNet18**
   Transfer learning will likely boost performance to **70–80%+** quickly.

2. **Add Class Weights or Sampler**
   Especially if your dataset has imbalanced class distribution.

3. **Experiment with LR Schedulers**
   Use a `ReduceLROnPlateau` or `StepLR` scheduler after val loss plateaus.

4. **Early Stopping**
   Implement early stopping at \~epoch 8 to avoid overfitting.

5. **Visual Diagnostics**

   * Add **confusion matrix**
   * Plot **loss curves** and **accuracy curves**


# Actions taken on the modified script for better accuracy
 a. Fine-tune more layers
Instead of freezing all layers, unfreeze the last few:

```
for name, param in model.named_parameters():
    if "layer4" in name or "fc" in name:
        param.requires_grad = True
    else:
        param.requires_grad = False
```
This keeps early layers (edges/textures) frozen but allows deeper layers to adapt to skin features.

c. Add data augmentation (not the same as adding images)
Before transforms.Resize(...), add:

```
transforms.RandomHorizontalFlip(),
transforms.RandomRotation(10),
transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
```
This improves generalization without collecting new data.