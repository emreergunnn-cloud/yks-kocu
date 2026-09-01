import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile } from "../../types/user";

export interface AuthResult {
  user: FirebaseUser;
  profile: UserProfile | null;
  isNewUser: boolean;
}
