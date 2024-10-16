import { atom, useAtom } from "jotai";
import { WorkspaceDataType } from "../type";

const workspaceAtom = atom<WorkspaceDataType | null>();

export const useWorkspace = () => {
  return useAtom(workspaceAtom);
};
