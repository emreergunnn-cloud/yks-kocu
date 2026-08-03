import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function completeOnboarding(
  uid: string,
  data: Record<string, any>
) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    onboardingCompleted: true,
    updatedAt: new Date(),
  });
}