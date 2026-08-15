import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

async function deleteSnapshotDocs(
  docs: Array<{
    ref: any;
  }>
) {
  const chunkSize = 450;

  for (
    let index = 0;
    index < docs.length;
    index += chunkSize
  ) {
    const batch =
      writeBatch(db);

    const chunk =
      docs.slice(
        index,
        index + chunkSize
      );

    for (const item of chunk) {
      batch.delete(item.ref);
    }

    await batch.commit();
  }
}

export async function clearAllCalendarEvents(
  uid: string
) {
  const ref = collection(
    db,
    "users",
    uid,
    "calendarEvents"
  );

  const snapshot =
    await getDocs(ref);

  await deleteSnapshotDocs(
    snapshot.docs
  );
}

export async function clearCalendarDay(
  uid: string,
  date: string
) {
  const ref = collection(
    db,
    "users",
    uid,
    "calendarEvents"
  );

  const q = query(
    ref,
    where(
      "date",
      "==",
      date
    )
  );

  const snapshot =
    await getDocs(q);

  await deleteSnapshotDocs(
    snapshot.docs
  );
}