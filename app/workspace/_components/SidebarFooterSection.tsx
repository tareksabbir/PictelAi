"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { UserButton } from "@clerk/nextjs";
import { useContext } from "react";

const SidebarFooterSection = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  return (
    <>
      <section className="p-4 border rounded-xl space-y-3 bg-secondary">
        <h2 className="text-sm text-muted-foreground flex items-center justify-between mb-3">
          Remaining Credits{" "}
          <span className="text-foreground font-bold">
            {userDetails?.credits || 0}
          </span>
        </h2>
        <Progress
          value={(userDetails?.credits * 100) / userDetails?.credits}
        ></Progress>
        <Button className="w-full">Upgrade to Pro</Button>
      </section>
      <section className="flex items-center gap-2 mt-4 p-4">
        <UserButton />
        <div>
          <p className="text-xs">Settings</p>
          <p className="text-xs font-semibold">{userDetails?.email}</p>
        </div>
      </section>
    </>
  );
};

export default SidebarFooterSection;
