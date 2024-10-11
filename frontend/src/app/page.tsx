"use client";
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import React from "react";
import { signOut } from "../../auth";
import { handleSignOut } from "./actions";
import UserButton from "@/features/auth/components/user-button";
import { useSession } from "next-auth/react";
// import { SignOut } from "@/lib/signIn";

const HomePage = () => {
  const { data: session, status } = useSession();
  return (
    <div className="h-screen w-screen">
      <Button onClick={() => handleSignOut()}>logout</Button>
      <UserButton
        username={session?.user.name as string}
        avatarUrl={session?.user.image as string}
      />
    </div>
  );
};

export default HomePage;
