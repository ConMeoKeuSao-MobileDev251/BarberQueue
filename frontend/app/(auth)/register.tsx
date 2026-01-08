/**
 * Register Screen Redirect
 * Redirects to unified auth screen for backward compatibility
 */
import { Redirect } from "expo-router";

export default function RegisterRedirect() {
  return <Redirect href={"/(auth)" as never} />;
}
