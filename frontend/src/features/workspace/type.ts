export type CreateWorkspaceDataType = {
  userId: string;
  name: string;
};

export type WorkSpaceDataType = {
  workspaceId: string;
  workspaceName: string;
  userId: string;
};

export type JoinWorkspaceType = {
  userId: string;
  workspaceId: string;
};
