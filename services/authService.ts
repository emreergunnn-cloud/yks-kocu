"use client";

export type { AuthResult } from "./auth/types";
export { getUserProfile, createStudentProfile } from "./auth/profileService";
export { signInWithGoogle } from "./auth/googleService";
export {
  signInWithEmail,
  registerWithEmail,
  sendPasswordReset,
} from "./auth/emailService";
export { logout, getIdToken } from "./auth/sessionService";

export {
  hasGoogleProvider,
  hasPasswordProvider,
  linkPasswordToUser,
} from "./auth/passwordService";
