import { SignInData, SignUpData } from "@/features/auth/type";
import axios from "axios";

export const LoginAPI = async (data: SignInData) => {
  const response = await axios.post("http://localhost:9000/login", data);
  console.log(response);
  return;
};

export const SignUpAPI = async (data: SignInData) => {
  const response = await axios.post("http://localhost:9000/signUp", data);
  console.log(response);
  return;
};
