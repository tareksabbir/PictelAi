"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const GetStarted = () => {
  const { user } = useUser();
  return (
    <>
      {!user ? (
        <SignInButton mode="redirect" forceRedirectUrl={"/workspace"}>
          <Button>
            Get Started <ArrowRight />
          </Button>
        </SignInButton>
      ) : (
        <Link href={"/workspace"}>
          <Button>
            Get Started <ArrowRight />
          </Button>
        </Link>
      )}
    </>
  );
};

export default GetStarted;
