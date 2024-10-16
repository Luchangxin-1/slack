"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, TrashIcon } from "lucide-react";
import { useWorkspace } from "../store/use-workspace";
import {
  deleteWorkspaceByworkspaceId,
  updateWorkspaceName,
} from "@/server/workspace";
import { toast } from "sonner";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { SignInData } from "@/features/auth/type";
import { WorkspaceRenameType } from "../type";
import { useConfirm } from "@/hooks/use-confirm";
interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initiaValue?: string;
}

const PreforencesModal = ({
  open,
  setOpen,
  initiaValue,
}: PreferencesModalProps) => {
  //states
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkspaceRenameType>();
  const [workspaceValue, setWorkspaceValue] = useState(initiaValue);
  const [workspace, setWorksace] = useWorkspace();
  const router = useRouter();
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] =
    useCreateWorkspaceModal();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you Sure?",
    "This action is irreversible"
  );
  //method
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    const resp = await deleteWorkspaceByworkspaceId(
      workspace?.workspaceId as string
    );
    if (resp.status === 200) {
      toast.success("delete workspace successfully!");
      setOpen(false);

      if (resp.data.length === 0) {
        router.replace("/");

        setIsWorkspaceModalOpen(true);
      } else {
        router.replace(`/workspace/${resp.data[0].workspaceId}`);
      }
    } else {
      toast.error("delete workspace faid!");
    }
    console.log(resp);
  };
  const onSubmit = async (data: WorkspaceRenameType) => {
    const resp = await updateWorkspaceName(data);
    if (resp.status === 200) {
      toast.success("update name sucessfully!");
      setWorksace(resp.data);
      setOpen(false);
    } else {
      toast.error("delete workspace faid!");
    }
    console.log(resp);
  };
  //hooks
  useEffect(() => {
    setValue("workspaceId", workspace?.workspaceId as string);
  }, [workspace]);
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{workspaceValue}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-2">
            {/* <div className="px-5 flex justify-between items-center py-4 bg-white rounded-lg border cursor-pointer hover:bg-white/20">
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold">workspace name</p>
              <p className="text-sm">{value}</p>
            </div>
            <p
              onClick={() => setIsEditOpen(true)}
              className="text-sm text-[#1264a3] hover:underline font-semibold"
            >
              Edit
            </p>
          </div> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                placeholder={workspaceValue}
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
                <p className="font-semibold text-sm">Rename workspace</p>
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
              <p className="font-semibold text-sm">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreforencesModal;
