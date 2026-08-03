# Firebase Setup, Environment Variables & Security Rules

## 1. Firebase Project Overview

- **Project ID**: `yks-kocu-cfd78`
- **Auth Provider**: Google OAuth (`GoogleAuthProvider`)
- **Database**: Cloud Firestore
- **Storage Bucket**: `yks-kocu-cfd78.firebasestorage.app`

---

## 2. Environment Variable Configuration

All Firebase connection credentials must be stored in `.env.local` for local development and injected as build environment variables in deployment platforms (e.g. Vercel / Firebase App Hosting).

### `.env.local` Template
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCe9AYhowb3XxIE14abVa-Jk9Hjhluz7c0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yks-kocu-cfd78.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yks-kocu-cfd78
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yks-kocu-cfd78.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=551440834645
NEXT_PUBLIC_FIREBASE_APP_ID=1:551440834645:web:0d163a003bf9b63fc5f4dc
```

---

## 3. Client Initialization (`lib/firebase.ts`)

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

---

## 4. Firestore Security Rules Specification (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile rule: Users can read/write only their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // User subcollections rule (exam_results, topic_progress, study_schedules)
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Legacy exam_results collection rule (backward compatibility)
    match /exam_results/{examId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```
