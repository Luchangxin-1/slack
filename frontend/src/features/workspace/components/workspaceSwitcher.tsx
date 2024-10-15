"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getWorkspaceByUserId } from "@/server/workspace";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useSession } from "next-auth/react";
import { Loader, Plus } from "lucide-react";
import { WorkSpaceDataType } from "../type";
import { useRouter } from "next/navigation";
interface WorkspaceSwitcherProps {
  workspaceId: string;
  userId: string;
}

const WorkspaceSwitcher = ({ workspaceId, userId }: WorkspaceSwitcherProps) => {
  //states
  const { data: session, status } = useSession();
  const [open, setOpen] = useCreateWorkspaceModal();
  const [workspaceIdList, setWorkspaceIdList] = useState<WorkSpaceDataType[]>(
    []
  );
  const router = useRouter();
  //method
  const getWorkspaceList = async () => {
    if (status != "authenticated") return;
    try {
      const res = await getWorkspaceByUserId(userId);
      console.log(res.data.workspace);
      setWorkspaceIdList(res.data.workspace.workspace);
    } catch (error) {
      console.log(error);
    }
  };
  const nowWorkspace = workspaceIdList?.filter(
    (workspace) => workspace.workspaceId == workspaceId
  )[0];
  const otherWorkspaceList = workspaceIdList.filter(
    (workspace) => workspace.workspaceId != workspaceId
  );
  //effects
  useEffect(() => {
    getWorkspaceList();
  }, [status]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceIdList.length == 0 ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            nowWorkspace.workspaceName.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() =>
            router.replace(`/workspace/${nowWorkspace.workspaceId}`)
          }
          className="cursor-default flex-col justify-start items-start capitalize font-bold"
        >
          {nowWorkspace?.workspaceName}
          <span className="text-xs text-muted-foreground font-normal">
            Active workspace
          </span>
        </DropdownMenuItem>
        {otherWorkspaceList?.map((workspace) => (
          <DropdownMenuItem
            onClick={() =>
              router.replace(`/workspace/${workspace.workspaceId}`)
            }
            className="cursor-pointer overflow-hidden truncate capitalize"
          >
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace.workspaceName.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.workspaceName}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
