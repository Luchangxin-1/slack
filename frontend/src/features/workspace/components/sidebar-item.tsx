import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useWorkspace } from "../store/use-workspace";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden ",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481359] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
interface SidebarItemProps {
  label: string;
  id: string;
  Icon: LucideIcon;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}
const SidebarItem = ({ label, id, Icon, variant }: SidebarItemProps) => {
  const [workspace, setWorksace] = useWorkspace();
  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link href={`/workspace/${workspace?.workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
