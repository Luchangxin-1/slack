export type SignInFlow = "signIn" | "signUp";

type AuthData = {
  email: string;
  password: string;
};
export type SignInData = AuthData;

export type SignUpData = {
  confirmPassword: string;
} & AuthData;
