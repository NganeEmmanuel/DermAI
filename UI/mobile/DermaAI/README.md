```
dermaai/
│── app/                      # Expo Router (App Router) main dir
│   ├── (tabs)/               # Bottom tab navigation (group)
│   │   ├── home.tsx          # Home screen
│   │   ├── diagnose.tsx      # Diagnose screen
│   │   ├── info.tsx          # Info screen
│   │
│   ├── diagnosis/            # Stack routes for Diagnosis Info
│   │   └── [id].tsx          # Diagnosis detail (opened from Home)
│   │
│   ├── settings.tsx          # Settings screen (optional, from Info)
│   ├── onboarding.tsx        # First-time onboarding flow
│   ├── layout.tsx            # Main navigation layout
│   └── index.tsx             # Default entry (can redirect to onboarding/home)
│
├── components/               # Reusable UI pieces
│   ├── DiagnosisCard.tsx     # Card for history items
│   ├── InfoCard.tsx          # Card for lesion info
│   ├── ImagePickerModal.tsx  # Capture/Upload modal
│   ├── TabsHeader.tsx        # Shared header
│   └── Button.tsx            # Custom button (primary/secondary)
│
├── hooks/                    # Custom React hooks
│   ├── useDiagnosis.ts       # Hook for running inference
│   ├── useStorage.ts         # Local storage (AsyncStorage/SQLite)
│   └── useNetwork.ts         # Detect online/offline
│
├── lib/                      # Core utilities & configs
│   ├── inference.ts          # ML inference logic (ResNet/TF Lite)
│   ├── api.ts                # Online fetch for LLM lesion info
│   └── theme.ts              # Colors, spacing, typography
│
├── assets/                   # Images, fonts, icons
│   ├── icons/
│   ├── fonts/
│   └── images/
│
├── types/                    # Global TypeScript types
│   ├── diagnosis.d.ts        # Diagnosis-related types
│   └── index.d.ts
│
└── package.json
```