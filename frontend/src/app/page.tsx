"use client";
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import React from "react";
import { signOut } from "../../auth";
import { handleSignOut } from "./actions";
import UserButton from "@/features/auth/components/user-button";
import { useSession } from "next-auth/react";
import api from '@/server/api'
// import { SignOut } from "@/lib/signIn";

const HomePage = () => {
  const { data: session, status } = useSession();
  const handle = async () => {
    try {
          const res = await api.get('/')
    console.log(res)
    } catch (error) {
      console.log(error)
    }

  }
  console.log(useSession())
  return (
    <div className="h-screen w-screen">
      <Button onClick={() =>{ localStorage.removeItem('token'),handleSignOut()}}>logout</Button>
      <UserButton
        username={session?.user.name as string}
        avatarUrl={session?.user.image as string}
      />
      <Button onClick={()=>handle()}>Hello</Button>
    </div>
  );
};

export default HomePage;
