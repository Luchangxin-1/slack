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
import { CreateWorkspaceDataType } from "../type";
import { useSession } from "next-auth/react";
import { createWorkspace } from "@/server/workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateWorkspaceModal = () => {
  //hooks
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceDataType>({
    defaultValues: {
      userId: session?.user.id,
      name: "",
    },
  });
  const [loading, setLoading] = useState(false);
  //method
  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = async (data: CreateWorkspaceDataType) => {
    setLoading(true);
    console.log("create workspace data:", data);
    try {
      const res = await createWorkspace({
        ...data,
        userId: session?.user.id as string,
      });
      console.log(res);
      if (res.success === "true") {
        toast.success(res.message);
        console.log(res.data);
        router.push(`/workspace/${res.data.workspace.workspaceId}`);
        setLoading(false);
        setOpen(false);
      } else {
        toast.error(res.message);
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
          <DialogTitle>Create a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={false}
            {...register("name")}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name"
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

export default CreateWorkspaceModal;
