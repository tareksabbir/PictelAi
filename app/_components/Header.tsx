import { Button } from "@/components/ui/button";

import Image from "next/image";
import GetStarted from "./GetStarted";

const MenuItems = [
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 shadow-md">
      {/* logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={140} height={50} />
      </div>
      {/* Menu options */}
      <div className="flex items-center gap-2">
        {MenuItems.map((menu, i) => (
          <Button key={i} variant={"ghost"}>
            {menu.name}
          </Button>
        ))}
      </div>

      {/* Get started Button */}
      <GetStarted />
    </header>
  );
};

export default Header;
