"use client";
import { useWorkspace } from "@/features/workspace/store/use-workspace";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  //hooks
  const router = useRouter();
  const [workspace, setWorksace] = useWorkspace();
  const { data: session, status } = useSession();
  const channelId = useMemo(
    () => workspace?.channels[0].channelId,
    [workspace]
  );
  useEffect(() => {
    if (channelId)
      router.push(`/workspace/${workspace?.workspaceId}/channel/${channelId}`);
  }, [workspace]);
  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <div></div>;
};

export default WorkspaceIdPage;
