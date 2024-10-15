import { atom, useAtom } from "jotai";

const workspaceAtom = atom();

export const UseWorkspace = () => {
  return useAtom(workspaceAtom);
};
