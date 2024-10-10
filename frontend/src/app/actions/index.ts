"use server";

import { signIn, signOut } from "../../../auth";
import { AuthError } from "next-auth";
interface handleCredentialsSigninProps {
  email: string;
  password: string;
}
export async function handleCredentialsSignin({
  email,
  password,
}: handleCredentialsSigninProps) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return {
      success: true,
      message: "login successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,

            message: "Invalid credentials",
          };
        default:
          return {
            success: false,
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}

export async function handleGithubSignin() {
  await signIn("github", { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut();
}
