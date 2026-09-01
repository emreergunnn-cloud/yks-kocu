export type AuthMode = "login" | "register" | "forgot";

export interface LoginPageProps {
  initialMode?: AuthMode;
}
