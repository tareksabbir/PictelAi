import { Button } from "@/components/ui/button";
import Image from "next/image";

const PlaygroundHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 shadow-md">
      <Image src="/logo.svg" alt="Logo" width={140} height={50} />
      <Button>Save</Button>
    </header>
  );
};

export default PlaygroundHeader;


