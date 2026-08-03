# Master Product Requirements Document (PRD)

## Project Name: YKS Koçu (YKS Coaching & Net Tracker)
**Version**: 1.0.0  
**Status**: Active / In Development  
**Source of Truth**: Yes  

---

## 1. Executive Summary & Vision

**YKS Koçu** is a comprehensive, modern web application designed for Turkish high school students and graduates preparing for the Higher Education Institutions Exam (YKS - Yükseköğretim Kurumları Sınavı). 

The platform serves as a personalized digital coach that tracks practice exam performances (TYT & AYT), calculates net scores automatically, monitors curriculum topic completion, provides visual analytics on target rankings, and leverages AI-assisted insights to help students achieve their goal departments and university rankings.

---

## 2. Target Audience

1. **Lise Öğrencileri (9, 10, 11, 12. Sınıf)**: High school students building early exam habits, tracking subject progress, and preparing for TYT/AYT.
2. **Mezun Adaylar (Graduates)**: Dedicated exam repeaters requiring rigorous daily tracking, net analysis, and goal ranking simulations.
3. **YKS Alanları**:
   - **Sayısal (MF)**: TYT + AYT Matematik, Fizik, Kimya, Biyoloji.
   - **Eşit Ağırlık (TM)**: TYT + AYT Matematik, Edebiyat, Tarih-1, Coğrafya-1.
   - **Sözel (TS)**: TYT + AYT Edebiyat, Tarih-1, Coğrafya-1, Tarih-2, Coğrafya-2, Felsefe Grubu, Din Kültürü.
   - **Dil (YDT)**: TYT + Yabancı Dil Testi.

---

## 3. Product Scope & Functional Requirements

### Module 1: Authentication & Onboarding
- **Google OAuth Integration**: One-click authentication via Firebase Authentication (`signInWithPopup`).
- **Student Profile Onboarding**:
  - Educational Grade: `9. Sınıf`, `10. Sınıf`, `11. Sınıf`, `12. Sınıf`, `Mezun`.
  - Target Field/Track: `Sayısal`, `Eşit Ağırlık`, `Sözel`, `Dil`.
  - Target Department (Hedef Bölüm): Text input (e.g. "Bilgisayar Mühendisliği").
  - Target Ranking (Hedef Sıralama): Numeric target (e.g. 5000).

### Module 2: Practice Exam Tracker (Deneme Takibi & Net Analiz)
- **Multi-Track Support**: Custom score input layouts tailored specifically to the user's field (`Sayısal`, `Eşit Ağırlık`, `Sözel`, `Dil`).
- **Automatic Net Calculation**:
  $$\text{Net} = \text{Doğru Sayısı} - \frac{\text{Yanlış Sayısı}}{4}$$
- **Input Validation**: Enforce section score limits:
  - TYT Türkçe: Max 40
  - TYT Sosyal Bilimler: Max 20
  - TYT Temel Matematik: Max 40
  - TYT Fen Bilimleri: Max 20 (Total TYT Max: 120 Net)
  - AYT Sections: Max 40 or 13/14 depending on subject breakdown (Total AYT Max: 80 Net).
- **Exam History & Edit/Delete**: View complete history of entered practice exams with filterable date ranges and exam publishers/names.

### Module 3: Curriculum Topic Mastery (Konu Takip Sistemi)
- **Complete YKS Syllabus**: Embedded checklist of official OSYM YKS topics categorized by subject.
- **Topic Statuses**:
  - `Tamamlandı` (Completed)
  - `Tekrar Edilecek` (Needs Review)
  - `Başlanmadı` (Not Started)
- **Progress Indicators**: Percentage completion bars per subject and overall TYT/AYT track.

### Module 4: Performance Analytics & Target Dashboard
- **YKS Countdown Widget**: Live countdown timer to the next YKS exam date.
- **Interactive Net Charts**: Visual line and bar charts showing TYT and AYT score progression over time.
- **Target Gap Analysis**: Real-time comparison between current average nets and required estimated nets for the target department/ranking.
- **Net Breakdown Widgets**: Section-by-section strength/weakness analysis.

### Module 5: Weekly Study Planner & Pomodoro Timer
- **Custom Routine Planner**: Drag-and-drop or checklist-based weekly study tasks.
- **Integrated Pomodoro Timer**: Dedicated timer for focused study sessions with session logging.

### Module 6: AI Performance Coach
- **AI Analytics**: Integration with Firebase AI Logic (Gemini API) to analyze low net sections, stagnant topics, and provide actionable weekly study recommendations.

---

## 4. Non-Functional Requirements

- **Performance**: Initial page load under 1.5s, seamless client-side transitions using Next.js App Router.
- **Design Excellence**: Modern dark/light theme options, rich micro-animations, glassmorphism, responsive mobile-first layouts.
- **Data Security**: Secure Firebase Auth state listeners, strict Firestore Security Rules, zero clear-text client credentials in source files.
- **Type Safety**: 100% TypeScript coverage with strict compiler options.

---

## 5. Architectural Principles & Constraints

1. **Source of Truth**: This `MASTER_PRD.md` document is the ultimate source of truth for features and project goals.
2. **Backward Compatibility**: Do not delete existing working code or files (`lib/firebase.ts`, `app/page.tsx`, `app/deneme/page.tsx`).
3. **Incremental Enhancement**: Build upon existing working prototypes cleanly without creating duplicate modules.
