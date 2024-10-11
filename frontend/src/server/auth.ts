import { SignInData, SignUpData } from "@/features/auth/type";
import axios, { AxiosError } from "axios";

export const LoginAPI = async (data: SignInData) => {
  try {
    const response = await axios.post("http://localhost:9000/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          `Error: ${error.response.data.message || "Unknown error"}`
        );
        throw new Error(error.response.data.message || "Login failed");
      } else if (error.request) {
        console.error("No response received from server");
        throw new Error("No response from server");
      } else {
        console.error("Error setting up request:", error.message);
        throw new Error(error.message);
      }
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};

export const SignUpAPI = async (data: SignUpData) => {
  console.log("Request data:", data);

  try {
    const response = await axios.post(
      "http://localhost:9000/signUp",
      {
        email: data.email, // 使用传入的 data 参数
        name: data.name,
        password: data.password,
        avatarUrl: data.avatarUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          `Error: ${error.response.data.message || "Unknown error"}`
        );
        throw new Error(error.response.data.message || "Sign up failed");
      } else if (error.request) {
        console.error("No response received from server");
        throw new Error("No response from server");
      } else {
        console.error("Error setting up request:", error.message);
        throw new Error(error.message);
      }
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
};
