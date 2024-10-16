export type CreateWorkspaceDataType = {
  userId: string;
  name: string;
};

export type WorkspaceDataType = {
  workspaceId: string;
  name: string;
  userId: string;
  users: string[];
};

export type JoinWorkspaceType = {
  userId: string;
  workspaceId: string;
};

export type WorkspaceRenameType = {
  name: string;
  workspaceId: string;
};
