import { CreateWorkspaceDataType } from "@/features/workspace/type";
import api from "./api";
import { auth } from "../../auth";
const getWorkspaceByUserId = async (userId: string) => {
  const resp = await api.get(
    `/workspace/get_workspace_by_userId?userId=${userId}`
  );
  console.log(resp.data);
  return resp.data;
};

const createWorkspace = async (data: CreateWorkspaceDataType) => {
  const resp = await api.post("/workspace/create_workspace", data);
  return resp.data;
};

export { getWorkspaceByUserId, createWorkspace };
