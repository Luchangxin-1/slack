"use client";
import { useChannel } from "@/features/workspace/store/use-channel";
import { getChannelBychannelId } from "@/server/workspace";
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
    console.log(res.data);
    setChannel(res.data);
  };
  useEffect(() => {
    getChannel();
  }, []);
  return <div>{params.channelId} </div>;
};

export default ChannelPage;
