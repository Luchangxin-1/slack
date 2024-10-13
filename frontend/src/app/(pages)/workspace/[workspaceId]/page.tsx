"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  const pathname = usePathname();
  // const workspaceId = useMemo(() => {
  //   return pathname.split("/").filter(Boolean).pop();
  // }, [pathname]);
  console.log(params);
  return <div>{params.workspaceId}</div>;
};

export default WorkspaceIdPage;
