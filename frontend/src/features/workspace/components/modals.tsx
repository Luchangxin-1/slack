"use client";
import React, { useEffect, useState } from "react";
import CreateWorkspaceModal from "./create-workspace-modal";
import { getWorkspaceByUserId } from "@/server/workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Modal = () => {
  //states
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  //method
  const check_workspace = async () => {
    try {
      if (status === "loading" || status === "unauthenticated") return;
      const res = await getWorkspaceByUserId(session?.user.id as string);
      if (res.success === "true") {
        // router.push(`/workspace/${res.data.workspace.workspaceId}`);
        console.log(res);
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // effects
  useEffect(() => {
    setMounted(true);
    check_workspace();
  }, [status, router]);
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};

export default Modal;
