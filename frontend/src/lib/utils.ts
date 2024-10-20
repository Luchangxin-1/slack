import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { resolve } from "path";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function verifyPassword(inputPassword: string, hashedPassword: string) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  return isMatch;
}
export const getUserFromDB = async (email: string, password: string) => {
  const user = await db.users.findUnique({ where: { email: email } });
  if (!user) {
    return {
      success: false,
      message: "User not found.",
    };
  }
  const isMatch = await verifyPassword(password, user.hash_password);
  console.log(isMatch, ":status of Login");
  if (isMatch) {
    return {
      success: true,
      data: user,
    };
  }
  return {
    success: false,
    message: "Password is incorrect.",
  };
};

export function fileToBase64(image: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(image);
  });
}

export function base64ToFile(base64: string): string {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteNumbers], { type: "image/jpg" });
  return URL.createObjectURL(blob);
}
