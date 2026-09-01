export type { AuthResult } from "./types";
export { getUserProfile, createStudentProfile } from "./profileService";
export { signInWithGoogle } from "./googleService";
export {
  signInWithEmail,
  registerWithEmail,
  sendPasswordReset,
} from "./emailService";
export { logout, getIdToken } from "./sessionService";

export {
  hasGoogleProvider,
  hasPasswordProvider,
  linkPasswordToUser,
} from "./passwordService";
