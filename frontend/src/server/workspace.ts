import {
  CreateWorkspaceDataType,
  JoinWorkspaceType,
} from "@/features/workspace/type";
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
const joinWorkspace = async (data: JoinWorkspaceType) => {
  const resp = await api.get(
    `/workspace/join_workspace?userOd=${data.userId}&workspaceId=${data.workspaceId}`
  );
  return resp.data;
};
const getUsersInWorkspace = async (workspaceId: string) => {
  const resp = await api.get(
    `/get_users_in_workspace?workspaceId=${workspaceId}`
  );
  return resp.data;
};
const getWorkspaceByWorkspaceId = async (workspaceId: string) => {
  const resp = await api.get(
    `/workspace/get_workspace_by_workspaceId?workspaceId=${workspaceId}`
  );
  return resp.data;
};
export {
  getWorkspaceByUserId,
  createWorkspace,
  joinWorkspace,
  getUsersInWorkspace,
  getWorkspaceByWorkspaceId,
};
