"use client";
import React, { useEffect, useMemo, useState } from "react";
import CreateWorkspaceModal from "./create-workspace-modal";
import {
  getWorkspaceByUserId,
  getWorkspaceByWorkspaceId,
} from "@/server/workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const Modal = () => {
  //states
  const pathname = usePathname();

  const workspaceId = useMemo(() => {
    const parts = pathname.split("/");
    if (parts[1] === "workspace" && parts[2]) {
      return parts[2];
    }
    return null;
  }, [pathname]);
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  //method
  const check_workspace = async () => {
    try {
      if (status === "loading" || status === "unauthenticated") return;
      const resNowWorkspace = await getWorkspaceByWorkspaceId(
        workspaceId as string
      );
      if (resNowWorkspace) {
        router.push(`/workspace/${resNowWorkspace.workspaceId}`);
        return;
      }
      console.log(resNowWorkspace);
      const res = await getWorkspaceByUserId(session?.user.id as string);
      if (res.success === "true") {
        router.push(
          `/workspace/${res.data.workspace.workspace[0].workspaceId}`
        );
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
