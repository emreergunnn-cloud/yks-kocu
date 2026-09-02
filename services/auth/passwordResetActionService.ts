import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function verifyResetCode(code: string): Promise<string> {
  auth.languageCode = "tr";
  return verifyPasswordResetCode(auth, code);
}

export async function applyNewPassword(
  code: string,
  password: string
): Promise<void> {
  auth.languageCode = "tr";
  await confirmPasswordReset(auth, code, password);
}
