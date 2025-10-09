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


//http://localhost:3000/playground/84082d37-651a-4c86-9ce8-d7afb28186fd?frameId=9274