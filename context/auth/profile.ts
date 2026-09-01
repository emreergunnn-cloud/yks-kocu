export {
  getUserProfile as fetchAuthUserProfile,
  createStudentProfile as createAuthUserProfile,
  ensureStudentProfile as loadOrCreateAuthUserProfile,
} from "@/services/auth/profileService";
