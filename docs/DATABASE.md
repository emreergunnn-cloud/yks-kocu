# Firestore Database Architecture & Schema Specification

## 1. Overview
The database layer for `YKS Koçu` is built on Cloud Firestore (NoSQL Document Database). The data model uses a user-centric hierarchical structure where private user data is scoped either in user documents or user subcollections.

---

## 2. Collection Schemas

### Collection 1: `users`
- **Path**: `users/{uid}`
- **Description**: Stores student profile, educational track, target university departments, and preferences.

```typescript
interface UserProfileDocument {
  uid: string;                 // Firebase Auth UID
  adSoyad: string;             // User full name
  email: string;               // User email address
  photoURL?: string;           // Profile picture URL
  sinif: "9" | "10" | "11" | "12" | "Mezun"; // Educational grade
  alan: "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil"; // Selected YKS track
  hedefBolum: string;          // Target department (e.g. "Tıp", "Bilgisayar Mühendisliği")
  hedefSiralama: number;       // Target ranking (e.g. 10000)
  createdAt: Timestamp;        // Profile creation timestamp
  updatedAt?: Timestamp;       // Profile update timestamp
}
```

---

### Collection 2: `exam_results`
- **Path**: `users/{uid}/exam_results/{examId}` (Secondary legacy route: `exam_results/{examId}`)
- **Description**: Individual practice exam records containing detailed section scores and calculated nets.

```typescript
interface SectionScore {
  dogru: number;
  yanlis: number;
  net: number; // dogru - (yanlis / 4)
}

interface ExamResultDocument {
  id?: string;
  uid: string;
  yayinAdi?: string;           // Practice exam publisher (e.g. "3D", "Bilgi Sarmal")
  denemeTipi: "TYT" | "AYT" | "TYT+AYT";
  alan: "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";
  
  // TYT Sections
  tytTurkce?: SectionScore;
  tytSosyal?: SectionScore;
  tytMat?: SectionScore;
  tytFen?: SectionScore;
  tytToplamNet: number;

  // AYT Sections (Dynamic according to alan)
  aytMat?: SectionScore;
  aytFizik?: SectionScore;
  aytKimya?: SectionScore;
  aytBiyoloji?: SectionScore;
  aytEdebiyat?: SectionScore;
  aytTarih1?: SectionScore;
  aytCografya1?: SectionScore;
  aytTarih2?: SectionScore;
  aytCografya2?: SectionScore;
  aytFelsefe?: SectionScore;
  aytDin?: SectionScore;
  aytDil?: SectionScore;
  aytToplamNet: number;

  createdAt: Timestamp;
}
```

---

### Collection 3: `topic_progress`
- **Path**: `users/{uid}/topic_progress/{subjectId}`
- **Description**: Student curriculum mastery tracking per subject.

```typescript
interface TopicItem {
  topicId: string;
  topicName: string;
  status: "Tamamlandı" | "Tekrar Edilecek" | "Başlanmadı";
  lastReviewedAt?: Timestamp;
}

interface SubjectTopicProgressDocument {
  subjectId: string; // e.g. "tyt_matematik", "ayt_fizik"
  completedCount: number;
  totalCount: number;
  topics: Record<string, TopicItem>;
  updatedAt: Timestamp;
}
```

---

## 3. Querying & Indexing Strategy

1. **User Exam Progression Query**:
   - Query: `where("uid", "==", currentUid).orderBy("createdAt", "desc")`
   - Purpose: Display score trend charts in chronological order.
2. **Subject Topic Mastery Query**:
   - Direct document fetch by subject ID: `doc(db, "users", uid, "topic_progress", subjectId)`

---

## 4. Data Validation Rules

- $0 \le \text{Net} \le \text{Max Section Questions}$
- $\text{Doğru} + \text{Yanlış} \le \text{Max Section Questions}$
- Net score formula must be validated server-side or in service wrappers: $Net = D - \frac{Y}{4}$.
