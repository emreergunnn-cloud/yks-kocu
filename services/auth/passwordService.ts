import {
  EmailAuthProvider,
  linkWithCredential,
  reload,
  type User,
} from "firebase/auth";

export function hasPasswordProvider(user: User): boolean {
  return user.providerData.some(
    (provider) => provider.providerId === "password"
  );
}

export function hasGoogleProvider(user: User): boolean {
  return user.providerData.some(
    (provider) => provider.providerId === "google.com"
  );
}

export async function linkPasswordToUser(
  user: User,
  password: string
): Promise<void> {
  if (!user.email) {
    throw new Error("auth/missing-email");
  }

  if (hasPasswordProvider(user)) {
    throw new Error("auth/provider-already-linked");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await linkWithCredential(user, credential);
  await reload(user);
}
