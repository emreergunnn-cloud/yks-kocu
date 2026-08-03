import { redirect } from "next/navigation";

/**
 * /exams redirects to /deneme for consistency with PRD routing.
 */
export default function ExamsRedirect() {
  redirect("/deneme");
}
