# Firebase Setup, Environment Variables & Security Rules

## 1. Firebase Project Overview

- **Project ID**: `yks-kocu-cfd78`
- **Auth Providers**: Email/Password + Google OAuth (`GoogleAuthProvider`)
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

## 4. Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write only their own document and subcollections
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Legacy top-level exam_results collection
    match /exam_results/{examId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

---

## 5. Firestore Composite Indexes (`firestore.indexes.json`)

The following composite indexes are required and defined in `firestore.indexes.json` at the project root.

### Why they're needed

Firestore requires a **composite index** whenever a query combines `where()` on one field with `orderBy()` on a different field.

### Required Indexes

| Collection | Fields | Direction | Used By |
|:---|:---|:---|:---|
| `exam_results` | `uid` → `createdAt` | ASC → DESC | `examService.getExamResults()` |
| `exam_results` | `uid` → `examType` → `createdAt` | ASC → ASC → DESC | Future filtered exam queries |

### Deploy Indexes

After cloning the repo, deploy the indexes to Firebase with:

```bash
npx firebase-tools@latest deploy --only firestore:indexes
```

> **Note**: Newly created indexes take a few minutes to build on the Firebase console. During this time, queries using those indexes will return an error with a direct link to create the index — clicking it opens Firebase Console with the index pre-filled.

### Single-Field Indexes (Auto-Managed)

These are automatically indexed by Firestore and do **not** require entries in `firestore.indexes.json`:

- `users` → `createdAt DESC` (admin user list)
- `users/{uid}/notifications` → `createdAt DESC` (notification feed)
- `users/{uid}/studySessions` → `startTime ASC` (streak computation)

---

## 6. Authentication Flow

| Action | Implementation | Redirect |
|:---|:---|:---|
| Email login | `signInWithEmailAndPassword` | `/dashboard` |
| Google login | `signInWithPopup` | `/dashboard` |
| Registration | `createUserWithEmailAndPassword` + Firestore user doc | `/dashboard` |
| Forgot password | `sendPasswordResetEmail` | Shows success screen (no redirect) |
| Logout | `signOut` | `/login` |
| Protected route (unauthenticated) | `ProtectedRoute` guard | `/login` |
| Auth page (already authenticated) | `LoginPage` `useEffect` | `/dashboard` |
