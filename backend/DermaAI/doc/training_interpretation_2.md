
# 📊 ResNet18 Training Results Summary

## 🧾 Epoch-wise Metrics

| Epoch | Train Loss | Train Acc | Val Loss   | Val Acc    |
| ----- | ---------- | --------- | ---------- | ---------- |
| 1     | 1.6224     | 45.27%    | 1.3176     | 53.97%     |
| 2     | 1.0389     | 57.70%    | 1.1070     | 61.79%     |
| 3     | 0.9015     | 63.09%    | 1.1872     | 61.28%     |
| 4     | 0.7481     | 67.80%    | 1.0971     | 61.97%     |
| 5     | 0.6607     | 70.74%    | 0.9667     | 67.58%     |
| 6     | 0.5895     | 73.61%    | 0.8875     | 71.11%     |
| 7     | 0.5220     | 75.44%    | 0.8879     | 70.78%     |
| 8     | 0.4509     | 78.38%    | 0.9289     | 71.26%     |
| 9     | 0.4255     | 79.34%    | **0.7892** | **74.68%** |
| 10    | 0.3600     | 82.43%    | 1.1481     | 68.00%     |

---

## 📌 Key Observations & Interpretations

### ✅ **Positive Trends**

* **Training Accuracy** steadily increased from **45.27% → 82.43%**, indicating effective learning.
* **Validation Accuracy** peaked at **74.68% (Epoch 9)**, which suggests the model was able to generalize reasonably well.
* **Validation Loss** also reached its minimum at **Epoch 9 (0.7892)**, which is what your script is using to **save the best model**.

### ⚠️ **Areas of Concern**

* **Overfitting after Epoch 9**: You can see a rise in validation loss (from **0.7892 → 1.1481**) in Epoch 10, while training loss continues to drop. This means the model is starting to memorize the training data instead of learning general patterns.
* **Train–Val Gap**: From Epoch 6 onwards, the gap between training and validation performance is increasingly noticeable. That suggests the model has **learned the training distribution too well** and is starting to diverge from validation patterns.

---

## 💾 What Model Are You Saving?

### 🧠 What’s Happening in the Script

```python
if epoch_loss < best_val_loss:
    best_val_loss = epoch_loss
    torch.save(model.state_dict(), "../model/dermai_model.pth")
```

You're saving the model **based on the lowest validation loss**, not the highest validation accuracy. This is usually preferred because:

* **Validation loss** is a smoother metric than accuracy, which can fluctuate.
* It reflects how well the model’s **confidence and predictions match the true labels**, not just how many it got right.

In your case:

* The best model was saved at **Epoch 9**, with:

  * `Val Loss = 0.7892`
  * `Val Acc = 74.68%`

This is indeed your **best-performing checkpoint** in terms of generalization and is what’s being saved.

### 📌 Note:

You also save the final model (after 10 epochs) using:

```python
torch.save(model, "../model/dermai_model.pt")
```

This is the **entire model (architecture + weights)** at the final epoch (Epoch 10), which overfits slightly. For inference, it's better to **load the `.pth` checkpoint into the same architecture** to maintain the best generalization performance.

---

## 🚀 How to Improve Generalization Without Adding Data

Here are some strategies you can try:

### 1. **Unfreeze More Layers Gradually**

* Currently, you're only training `layer4` and `fc`.
* Try **gradual unfreezing**:

  * Start by training `layer4` and `fc`
  * Then unfreeze `layer3`, retrain
  * Eventually include `layer2` if needed
* This allows **fine-tuning more features** from the pretrained model, enhancing generalization.

### 2. **Use a Validation-Based Early Stopping Strategy**

* Stop training **when validation loss stops improving**, instead of fixed `num_epochs=10`.
* Prevents overfitting like seen in Epoch 10.

### 3. **Adjust Learning Rate Schedule**

* Your current scheduler reduces LR on plateau with patience of 2.
* Consider:

  * **Cosine Annealing LR**
  * **Cyclic LR**
  * **Warm restarts** – good for pushing out of local minima

### 4. **Add Regularization**

* Add **Dropout** in the fully connected layers
* You can also add **L2 weight decay** in the optimizer:

```python
optimizer = optim.Adam(trainable_params, lr=0.001, weight_decay=1e-4)
```

### 5. **Use Stronger Data Augmentations**

* Your current augmentation is good, but could include:

  * **Random cropping**
  * **Random affine transforms**
  * **CutMix or MixUp (advanced)**
* Try [`torchvision.transforms.RandomErasing`](https://pytorch.org/vision/stable/transforms.html#torchvision.transforms.RandomErasing) to simulate occlusions

### 6. **Try Label Smoothing**

* Helps the model become less overconfident and improves generalization:

```python
criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
```

### 7. **Ensemble or Test-Time Augmentation (TTA)**

* For deployment or testing, average predictions across multiple augmented versions of the same image.

---

## 📉 Test Accuracy vs Validation Accuracy

* **Validation Accuracy (best):** 74.68%
* **Test Accuracy:** 69.05%

This \~5% drop is **normal** but also a sign your model slightly **overfits to val set**. It’s a good time to:

* Try **cross-validation**
* Evaluate **confusion matrix** to inspect class-wise performance
* Investigate potential **label noise or class imbalance**, despite your weighted loss

---

## ✅ Final Notes

* You are on the **right track**. A \~75% val accuracy and \~69% test accuracy from a pretrained ResNet18 (with only layer4+fc unfrozen) is decent.
* With the suggested techniques (especially unfreezing more layers and early stopping), you could likely push test accuracy closer to **75–78%** even without more data.



NB: Remove rash dataset. allow just measles. temporarily delete the folder not permanently 