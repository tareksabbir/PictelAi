"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

const GetStarted = () => {
  const { user } = useUser();
  return (
    <>
      {!user ? (
        <SignInButton mode="redirect" forceRedirectUrl={"/workspaces"}>
          <Button>
            Get Started <ArrowRight />
          </Button>
        </SignInButton>
      ) : (
        <Button>
          Get Started <ArrowRight />
        </Button>
      )}
    </>
  );
};

export default GetStarted;
