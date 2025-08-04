
```
dermaAI/
├── main.py                    # entry point
├── requirements.txt
├── /data/                     # raw & processed images
│   ├── /raw/                  # put original images here
│   └── /processed/            # output folder for resized images
├── /notebooks/                # optional: Jupyter explorations
├── /preprocessing/            # image preparation
│   └── image_resizer.py
├── /model/                    # training, loading, saving model
├── /api/                      # optional Flask/FastAPI server
└── /utils/                    # helper functions
```