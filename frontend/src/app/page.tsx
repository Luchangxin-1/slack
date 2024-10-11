"use client";
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import React from "react";
import { signOut } from "../../auth";
import { handleSignOut } from "./actions";
// import { SignOut } from "@/lib/signIn";

const HomePage = () => {
  return (
    <div className="h-screen w-screen">
      <Button onClick={() => handleSignOut()}>logout</Button>
    </div>
  );
};

export default HomePage;
