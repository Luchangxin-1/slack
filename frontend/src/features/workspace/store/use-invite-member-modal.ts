import { users } from "@prisma/client";
import { atom, useAtom } from "jotai";

const workspaceMemberAtom = atom<users[] | null>();

export const useWorkspaceMember = () => {
  return useAtom(workspaceMemberAtom);
};
