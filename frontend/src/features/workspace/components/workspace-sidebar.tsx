import { getUsersInWorkspace } from "@/server/workspace";
import { users } from "@prisma/client";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useWorkspace } from "../store/use-workspace";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import WorkspaceSection from "./workspace-section";
import { useWorkspaceMember } from "../store/use-workpace-member";
import UserItem from "./user-item";
import { Separator } from "@/components/ui/separator";
import { useCreateChannelModal } from "@/features/channel/store/use-create-channel-modal";
import { useSession } from "next-auth/react";
interface WorkspaceSidebarProps {
  workspaceId: string;
}
const WorkspaceSidebar = ({ workspaceId }: WorkspaceSidebarProps) => {
  //states
  const [workspaceMember, setWorkspaceMember] = useWorkspaceMember();
  const [workspace, setWorksace] = useWorkspace();
  const { data: session } = useSession();
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useCreateChannelModal();
  const GetUsersInWorkspaceAndWorkspace = async () => {
    if (workspaceId == undefined) return;
    const users = await getUsersInWorkspace(workspaceId);
    setWorkspaceMember(users);
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
  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" Icon={MessageSquareText} id="threads" />

        <SidebarItem label="Drafts & Sent" Icon={SendHorizonal} id="Drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={() => {
          workspace.userId == session?.user.id &&
            setIsCreateChannelModalOpen(true);
        }}
      >
        {workspace.channels.length > 0 &&
          workspace?.channels.map((channel) => (
            <SidebarItem
              key={channel.channelId}
              Icon={HashIcon}
              label={channel.name}
              id={channel.channelId}
            />
          ))}
      </WorkspaceSection>
      <WorkspaceSection label="Members" hint="New member" onNew={() => {}}>
        {workspaceMember &&
          workspaceMember?.map((member) => (
            <UserItem
              label={member.name}
              id={member.id as unknown as string}
              key={member.id}
              image={member.avatarUrl as string}
            />
          ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
