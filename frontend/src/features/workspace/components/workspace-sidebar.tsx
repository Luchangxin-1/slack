import { getUsersInWorkspace } from "@/server/workspace";
import { users } from "@prisma/client";
import { AlertTriangle, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UseWorkspace } from "../store/use-workspace";
interface WorkspaceSidebarProps {
  workspaceId: string;
}
const WorkspaceSidebar = ({ workspaceId }: WorkspaceSidebarProps) => {
  //states
  const [workspaceUsers, setWorkspaceUsers] = useState<users[]>([]);
  const [workspace, setWorksace] = UseWorkspace();
  const GetUsersInWorkspaceAndWorkspace = async () => {
    if (workspaceId == undefined) return;
    const users = await getUsersInWorkspace(workspaceId);
    setWorkspaceUsers(users);
    console.log("Users list in this workspace:", users);
  };
  useEffect(() => {
    GetUsersInWorkspaceAndWorkspace();
  }, [workspaceId]);
  if (workspaceId == undefined) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full  items-center justify-center">
        <Loader className="size-5 animate-spin shrink-0 text-white/60" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className="flex flex-col gap-y-2 h-full bg-[#5E2C5F]  items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return <div>{workspaceId}</div>;
};

export default WorkspaceSidebar;
