# Codebase Standards & Development Conventions

## 1. Core Engineering Rules & Directives

1. **Do NOT Rewrite Working Code**: Preserve existing functions and working prototypes (`lib/firebase.ts`, `app/page.tsx`, `app/deneme/page.tsx`). Extend functionality cleanly through hooks, wrappers, and modular services.
2. **Do NOT Delete Existing Files**: Retain existing codebase structure.
3. **Do NOT Create Duplicate Implementations**: Audit existing utility functions, hooks, or service methods before writing custom logic.
4. **Follow MASTER_PRD.md as Source of Truth**: Every architectural decision or feature addition must align with [MASTER_PRD.md](file:///c:/Users/emree/Desktop/yks-kocu/MASTER_PRD.md).
5. **Keep Build Clean After Every Change**: Run `npm run build` to verify type safety and compilation after major file additions.

---

## 2. Next.js 16 & React 19 Conventions

- **Next.js 16 App Router Compliance**:
  - Heed deprecation notices in Next 16 (`node_modules/next/dist/docs/`).
  - Declare `"use client";` at the top of client-side component files using browser APIs (`useState`, `useEffect`, `signInWithPopup`).
  - Keep page components clean by moving heavy logic into custom hooks (`useAuth`, `useExamResults`) and service abstractions (`services/`).
- **React 19 Hooks**:
  - Prefer modern hooks (`useActionState`, `useFormStatus`, `useTransition`) where server actions or transitions are applied.

---

## 3. TypeScript Standards

- **Strict Type Enforcement**: Avoid using `any` types. Define explicit TypeScript interfaces in `types/`.
- **Interface & Type Naming**:
  - Interfaces: PascalCase (e.g. `UserProfile`, `ExamResult`).
  - Functions: camelCase (e.g. `calculateNetScore`, `saveUserProfile`).
  - Components: PascalCase (e.g. `Navbar`, `ExamCard`).
- **File Extensions**: Use `.tsx` for React components; use `.ts` for pure TypeScript services, utilities, and types.

---

## 4. Error Handling & Form Validation

- **Form Input Validation**: Never trust user numerical inputs blindly. Validate bounds (e.g., maximum questions per YKS section) and handle `isNaN` conditions gracefully.
- **Service Layer Try/Catch**: Wrap Firestore reads/writes in explicit `try/catch` blocks. Return structured result objects:
  ```typescript
  type ServiceResponse<T> = 
    | { success: true; data: T }
    | { success: false; error: string };
  ```
- **Silent Failures Prohibition**: Never wrap failing code in empty `catch {}` blocks or swallow API errors silently.

---

## 5. UI & Styling Rules

- **Tailwind CSS v4 Usage**: Use Tailwind utility classes directly in `className` props.
- **Color Token Consistency**: Use semantically named colors (`bg-slate-900`, `text-blue-500`, `border-slate-800`) matching `docs/UI_GUIDELINES.md`.
- **No Hardcoded Magic Offsets**: Compute dynamic bounds or rely on Tailwind flex/grid layout utilities rather than manual pixel offsets.
