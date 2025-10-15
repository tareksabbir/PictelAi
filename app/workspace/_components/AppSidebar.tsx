import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import ProjectList from "./ProjectList";
import SidebarFooterSection from "./SidebarFooterSection";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/workspace"} className="flex items-center gap-2 p-4">
          <Image src="/logo.svg" alt="Logo" width={140} height={50} />
        </Link>
        <Link href={"/workspace"} className="mt-5 w-full px-4">
          <Button className="w-full"> + Add New Project</Button>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <ProjectList />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterSection />
      </SidebarFooter>
    </Sidebar>
  );
}
