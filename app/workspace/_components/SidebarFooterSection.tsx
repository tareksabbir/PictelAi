"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useContext } from "react";
import { Crown, Sparkles } from "lucide-react";

const SidebarFooterSection = () => {
  const { userDetails } = useContext(UserDetailsContext);
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const credits = userDetails?.credits || 0;
  const maxCredits = userDetails?.maxCredits || 2;
  const progressValue = maxCredits > 0 ? (credits / maxCredits) * 100 : 0;
  const isLowCredits = credits < maxCredits * 0.2;

  return (
    <div className="space-y-4">
      <section className="p-4 border rounded-xl bg-secondary">
        {hasUnlimitedAccess ? (
          <div className="flex items-center gap-2 py-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-black">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 ml-2">
              <h3 className="text-sm font-semibold flex items-center gap-1">
                Pro Plan
              </h3>
              <p className="text-xs text-muted-foreground">Unlimited credits</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm text-muted-foreground">
                Remaining Credits
              </h2>
              <span
                className={`text-sm font-bold ${
                  isLowCredits ? "text-gray-500" : "text-foreground"
                }`}
              >
                {credits} / {maxCredits}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
            {isLowCredits && credits > 0 && (
              <p className="text-xs text-gray-500 font-medium">
                Running low on credits
              </p>
            )}
            {credits === 0 && (
              <p className="text-xs text-destructive font-medium">
                No credits remaining
              </p>
            )}
            {/* <Link href="/workspace/pricing" className="block w-full"> */}
            <Button className="w-full" size="sm">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
            {/* </Link> */}
          </div>
        )}
      </section>

      <section className="flex items-center gap-3 p-4 border rounded-xl bg-secondary/50">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">Account</p>
          <p className="text-sm font-semibold truncate">
            {userDetails?.email || "Loading..."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default SidebarFooterSection;
