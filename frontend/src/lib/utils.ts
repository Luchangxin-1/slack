import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { db } from "./db";
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
