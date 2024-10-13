"use client";
import Sidebar from "@/features/workspace/components/sidebar";
import ToolBar from "@/features/workspace/components/toolbar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdLayout = ({ children, params }: WorkspaceIdLayoutProps) => {
  const { data: session, status } = useSession();
  return (
    <div className="w-screen h-full">
      <ToolBar workspaceId={params.workspaceId} />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar
          user={session?.user as Session["user"]}
          workspaceId={params.workspaceId}
        />
        {children}
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
