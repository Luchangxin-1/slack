"use client";
import ChannelHeader from "@/features/channel/components/channel-header";
import { useChannel } from "@/features/channel/store/use-channel";
import { getChannelBychannelId } from "@/server/workspace";
import { AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";
interface ChannelIdPageProps {
  params: {
    workspaceId: string;
    channelId: string;
  };
}
const ChannelPage = ({ params }: ChannelIdPageProps) => {
  //hooks
  const [channel, setChannel] = useChannel();
  const getChannel = async () => {
    const res = await getChannelBychannelId(params.channelId);
    setChannel(res.data);
  };
  useEffect(() => {
    getChannel();
  }, [params.channelId]);
  if (!channel)
    return (
      <div className="flex flex-col gap-y-2 h-full bg-[#5E2C5F]  items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Channel not found</p>
      </div>
    );
  return (
    <div>
      <ChannelHeader channelName={channel.name} />
    </div>
  );
};

export default ChannelPage;
