"use client";
import Sidebar from "@/features/workspace/components/sidebar";
import ToolBar from "@/features/workspace/components/toolbar";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/features/workspace/components/workspace-sidebar";
import { atom, useAtom } from "jotai";
import { useWorkspace } from "@/features/workspace/store/use-workspace";
import { getWorkspaceByWorkspaceId } from "@/server/workspace";
import { useEffect } from "react";
interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdLayout = ({ children, params }: WorkspaceIdLayoutProps) => {
  const { data: session, status } = useSession();
  const [workspace, setWorksace] = useWorkspace();
  const getWorkspace = async () => {
    const resp = await getWorkspaceByWorkspaceId(params.workspaceId);
    setWorksace(resp);
    console.log(resp);
  };
  useEffect(() => {
    getWorkspace();
  }, [params]);
  return (
    <div className="w-screen h-full">
      <ToolBar workspaceId={params.workspaceId} />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar
          user={session?.user as Session["user"]}
          workspaceId={params.workspaceId}
        />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar workspaceId={params.workspaceId} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
