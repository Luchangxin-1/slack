import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { createMessage } from "@/server/message";
import { useChannel } from "../store/use-channel";
import { base64ToFile, fileToBase64 } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Editor = dynamic(() => import("./editor"), { ssr: false });
interface ChatInputProps {
  placholder: string;
}
const ChatInput = ({ placholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const { data: session, status } = useSession();
  const [channel, setChannel] = useChannel();
  const editorRef = useRef<Quill | null>(null);
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    const imageToBase64 =
      image === null ? "" : await fileToBase64(image as File);
    if (status === "loading") return;
    try {
      const resp = await createMessage({
        userId: session?.user.id as string,
        channelId: channel?.channelId as string,
        body: body,
        images: imageToBase64,
        parentId: "",
      });
      console.log("meassage send:", resp);
    } catch (error) {
      console.log(error);
    }

    setEditorKey((prevKey) => prevKey + 1);
  };
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        placholder={placholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
