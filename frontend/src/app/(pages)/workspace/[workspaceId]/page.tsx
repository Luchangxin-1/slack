"use client";
import { useChannel } from "@/features/channel/store/use-channel";
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
  const [channel, setChannel] = useChannel();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (channel?.channelId)
      router.push(
        `/workspace/${workspace?.workspaceId}/channel/${channel.channelId}`
      );
  }, [workspace]);
  if (status === "loading") {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <div>cfhdh</div>;
};

export default WorkspaceIdPage;
