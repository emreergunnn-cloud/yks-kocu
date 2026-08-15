import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  SavedStudyPlan,
} from "./types";

export async function getStudyPlans(
  uid: string
): Promise<SavedStudyPlan[]> {
  const ref = collection(
    db,
    "users",
    uid,
    "studyPlans"
  );

  const snapshot =
    await getDocs(ref);

  return snapshot.docs.map(
    (item) => {
      const data =
        item.data() as Omit<
          SavedStudyPlan,
          "id"
        >;

      return {
        id: item.id,
        ...data,
      };
    }
  );
}