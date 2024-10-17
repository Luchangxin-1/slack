import { users } from "@prisma/client";
import { atom, useAtom } from "jotai";
// import { WorkspaceDataType } from "../type";

const workspaceMemberAtom = atom<users[] | null>();

export const useWorkspaceMember = () => {
  return useAtom(workspaceMemberAtom);
};
