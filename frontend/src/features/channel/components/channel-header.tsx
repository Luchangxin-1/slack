import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ChannelRenameType } from "../type";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  deleteChannelBychannelId,
  updateChannelName,
} from "@/server/workspace";
import { useChannel } from "../store/use-channel";
import { useWorkspace } from "@/features/workspace/store/use-workspace";
import { useRouter } from "next/navigation";

interface ChannelHeaderProps {
  channelName: string;
}
const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChannelRenameType>();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you Sure?",
    "This action is irreversible"
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [channel, setChannel] = useChannel();
  const [workpace, setWorksace] = useWorkspace();
  //method
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    const resp = await deleteChannelBychannelId(
      channel?.channelId as string,
      workpace?.workspaceId as string
    );
    console.log(resp);
    if (resp.status === "success") {
      toast.success("delete channel successfully!");
      setOpen(false);
      setWorksace(resp.data);
      if (resp.data.channels?.length > 0) {
        setChannel(resp.data.channels[0]);
        router.push(
          `/workspace/${workpace?.workspaceId}/channel/${resp.data.channels[0].channelId}`
        );
      } else {
        setChannel({ name: "", workspaceId: "", channelId: "" });
        router.push(`/workspace/${workpace?.workspaceId}`);
      }
    } else {
      toast.error("delete channel failed!");
    }
    console.log(resp);
  };
  const onSubmit = async (data: ChannelRenameType) => {
    const resp = await updateChannelName({
      ...data,
      channelId: channel?.channelId as string,
    });
    console.log(resp);
    if (resp.status === "success") {
      toast.success(resp.message);
      setWorksace(resp.data);
      setOpen(false);
    } else {
      toast.error(resp.message);
    }
    console.log(resp);
  };
  //hooks

  return (
    <div className="flex bg-white border-b h-[49px] items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate"># {channelName}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {channelName}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder={channelName}
                disabled={false}
                {...register("name")}
                required
              />
              <button
                disabled={false}
                type="submit"
                className="flex w-full items-center mt-2 gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 "
              >
                <Edit size-4 />
                <p className="font-semibold text-sm">Rename channels</p>
              </button>
            </form>

            <button
              disabled={false}
              onClick={() => {
                handleDelete();
              }}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon size-4 />
              <p className="font-semibold text-sm">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelHeader;
