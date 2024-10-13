"use client";
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import React, { useEffect } from "react";
import { signOut } from "../../auth";
import { handleSignOut } from "./actions";
import UserButton from "@/features/auth/components/user-button";
import { useSession } from "next-auth/react";

import { useCreateWorkspaceModal } from "@/features/workspace/store/use-create-workspace-modal";
import { getWorkspaceByUserId } from "@/server/workspace";
import { useRouter } from "next/navigation";
import CreateWorkspaceModal from "@/features/workspace/components/create-workspace-modal";
// import { SignOut } from "@/lib/signIn";

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  // const handle = async () => {
  //   try {
  //     const res = await getWorkspaceByUserId("2");
  //     if (res.success === "true") {
  //       // router.push(`/workspace/${2}`);
  //       console.log(res);
  //     } else if (!isModalOpen) {
  //       setIsModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   console.log(isModalOpen);
  //   handle();
  // }, [isModalOpen]);
  return (
    <div className="h-screen w-screen">
      <Button
        onClick={() => {
          localStorage.removeItem("token"), handleSignOut();
        }}
      >
        logout
      </Button>
      <UserButton
        username={session?.user.name as string}
        avatarUrl={session?.user.image as string}
      />
      <Button onClick={() => setIsModalOpen(true)}>create</Button>
      {/* <Button onClick={() => handle()}>Hello</Button> */}
    </div>
  );
};

export default HomePage;
