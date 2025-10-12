"use client";
import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

const PlaygroundHeader = () => {
  const { onSaveData, setOnSaveData } = useContext(OnSaveContext);
  return (
    <header className="flex items-center justify-between p-4 shadow-md">
      <Link href={"/"}>
        <Image src="/logo.svg" alt="Logo" width={140} height={50} />
      </Link>
      <Button onClick={() => setOnSaveData(Date.now())}>Save</Button>
    </header>
  );
};

export default PlaygroundHeader;
