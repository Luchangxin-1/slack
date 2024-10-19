"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useForm } from "react-hook-form";
import { CreateChannelType } from "../type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { createChannel } from "@/server/workspace";
import { useWorkspace } from "@/features/workspace/store/use-workspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useChannel } from "../store/use-channel";

const CreateChannelModal = () => {
  //hooks
  const router = useRouter();
  const [workpace, setWorksace] = useWorkspace();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChannelType>({
    defaultValues: {
      name: "",
      workspaceId: workpace?.workspaceId,
    },
  });
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useChannel();
  const [open, setOpen] = useCreateChannelModal();

  //methods
  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = async (data: CreateChannelType) => {
    setLoading(true);
    console.log("create workspace data:", data);
    try {
      const { data: respData } = await createChannel({
        ...data,
        workspaceId: workpace?.workspaceId as string,
      });
      console.log(respData);
      if (respData.status === "success") {
        toast.success(respData.message);
        setOpen(false);
        setChannel(respData.data);
        router.push(
          `/workspace/${workpace?.workspaceId}/channel/${respData.data.channelId}`
        );
        // respData.data.channelId;
      } else {
        toast.error(respData.message);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={false}
            {...register("name")}
            required
            autoFocus
            minLength={3}
            placeholder="Channel name"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="flex justify-end items-end"
            >
              {!loading ? "Continue" : <Spinner />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
