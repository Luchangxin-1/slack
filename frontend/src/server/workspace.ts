import {
  ChannelCreateType,
  CreateWorkspaceDataType,
  JoinWorkspaceType,
  WorkspaceRenameType,
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
  const resp = await api.post(`/workspace/join_workspace`, data);
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
const deleteWorkspaceByworkspaceId = async (workspaceId: string) => {
  const resp = await api.delete("/workspace/delect_workspace_by_workspaceId", {
    params: {
      workspaceId: workspaceId,
    },
  });
  return resp;
};
const updateWorkspaceName = async (data: WorkspaceRenameType) => {
  const resp = await api.post("/workspace/update_workspace_name", data);
  return resp;
};
const createChannel = async (data: ChannelCreateType) => {
  const resp = await api.post("/workspace/create_channel", data);
  return resp;
};
const getChannelBychannelId = async (channelId: string) => {
  const resp = await api.get(
    `/workspace/get_channel_by_channelId?channelId=${channelId}`
  );
  return resp.data;
};
export {
  getWorkspaceByUserId,
  createWorkspace,
  joinWorkspace,
  getUsersInWorkspace,
  getWorkspaceByWorkspaceId,
  deleteWorkspaceByworkspaceId,
  updateWorkspaceName,
  createChannel,
  getChannelBychannelId,
};
