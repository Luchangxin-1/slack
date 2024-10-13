"use client";
import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import React from "react";
interface ToolBarProps {
  workspaceId: string;
}
const ToolBar = ({ workspaceId }: ToolBarProps) => {
  return (
    <nav className="w-full bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[624px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/40 w-full justify-start items-center h-6"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search workspace</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
      <div>{workspaceId}</div>
    </nav>
  );
};

export default ToolBar;
