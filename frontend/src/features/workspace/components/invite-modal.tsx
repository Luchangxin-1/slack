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
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Spinner from "@/components/spinner";
import { CreateWorkspaceDataType, InviteMemberType } from "../type";
import { useSession } from "next-auth/react";
import { createWorkspace, joinWorkspace } from "@/server/workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspace } from "../store/use-workspace";
interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const InviteModal = ({ open, setOpen }: InviteModalProps) => {
  //hooks
  const { data: session } = useSession();
  const [workspace, setWorksace] = useWorkspace();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteMemberType>({
    defaultValues: {
      userId: "",
      workspaceId: "",
    },
  });
  const [loading, setLoading] = useState(false);
  //method
  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = async (data: InviteMemberType) => {
    console.log({ ...data, workspaceId: workspace?.workspaceId });
    const res = await joinWorkspace({
      ...data,
      workspaceId: workspace?.workspaceId as string,
    });
    if (res.status === "success") {
      setOpen(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    console.log(res);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={false}
            {...register("userId")}
            required
            autoFocus
            placeholder="Member id"
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

export default InviteModal;
