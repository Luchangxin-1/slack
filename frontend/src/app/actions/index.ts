"use server";

import { getToken } from "next-auth/jwt";
import { signIn, signOut, auth } from "../../../auth";
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

export async function getSession() {
  const session = await auth();
  return session;
}
