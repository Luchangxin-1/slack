import { atom, useAtom } from "jotai";
import { WorkspaceDataType } from "../type";
import { channel } from "@prisma/client";

const channelAtom = atom<channel | null>();

export const useChannel = () => {
  return useAtom(channelAtom);
};
