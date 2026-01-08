/**
 * Login Screen Redirect
 * Redirects to unified auth screen for backward compatibility
 */
import { Redirect } from "expo-router";

export default function LoginRedirect() {
  return <Redirect href={"/(auth)" as never} />;
}
