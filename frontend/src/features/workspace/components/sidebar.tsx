"use client";
import UserButton from "@/features/auth/components/user-button";
import { Session } from "next-auth";
import React from "react";
import WorkspaceSwitcher from "./workspaceSwitcher";
import SidebarButton from "./sidebarButton";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
interface SidebarProps {
  workspaceId: string;
  user: Session["user"];
}
const Sidebar = ({ user, workspaceId }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher
        workspaceId={workspaceId}
        userId={user?.id as string}
      />
      <SidebarButton
        icon={Home}
        label="Home"
        isActivate={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquare} label="DMs" />

      <SidebarButton icon={Bell} label="Activaty" />

      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton
          username={user?.name as string}
          avatarUrl={user?.image as string}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
