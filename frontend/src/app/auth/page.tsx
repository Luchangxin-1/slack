"use server";
import AuthScreen from "@/features/auth/components/auth-screen";
import React from "react";

const Auth = () => {
  return (
    <div className="w-screen h-screen justify-center items-center">
      <AuthScreen />
    </div>
  );
};

export default Auth;
