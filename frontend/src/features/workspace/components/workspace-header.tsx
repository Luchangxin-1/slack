import { Button } from "@/components/ui/button";

import React, { useEffect, useState } from "react";
import { useWorkspace } from "../store/use-workspace";
import { ChevronDownIcon, ListFilter, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Hint from "@/components/hint";
import PreferencesModal from "./preferences-modal";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import InviteModal from "./invite-modal";

const WorkspaceHeader = () => {
  //hooks
  const [workspace, setWorkspace] = useWorkspace();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] =
    useCreateWorkspaceModal();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  useEffect(() => {
    session?.user.id === workspace?.userId
      ? setIsAdmin(true)
      : setIsAdmin(false);
  }, [status]);
  return (
    <>
      <InviteModal open={isInviteOpen} setOpen={setIsInviteOpen} />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initiaValue={workspace?.name}
      />
      <div className="flex items-center justify-between px-4 h-[50px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg  w-auto p-1.5 overflow-hidden"
              size-sm
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDownIcon className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2 size-9 relative">
                {workspace?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Activate workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {
                    setIsInviteOpen(true);
                  }}
                >
                  Invite people to {workspace?.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => {
                    setPreferencesOpen(true);
                  }}
                >
                  Preforences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.8">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter size-4 />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button
              variant="transparent"
              size="iconSm"
              onClick={() => {
                console.log(isWorkspaceModalOpen);

                setIsWorkspaceModalOpen(true);
              }}
            >
              <SquarePen size-4 />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
