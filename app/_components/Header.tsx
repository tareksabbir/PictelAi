import { Button } from "@/components/ui/button";

import Image from "next/image";
import GetStarted from "./GetStarted";
import Link from "next/link";

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
      <Link href={"/"} className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={140} height={50} />
      </Link>
      {/* Menu options */}
      <div className="flex items-center gap-2">
        {MenuItems.map((menu, i) => (
          <Link href={menu.path} key={i}>
            <Button variant={"ghost"} className="font-semibold">
              {menu.name}
            </Button>
          </Link>
        ))}
      </div>

      {/* Get started Button */}
      <GetStarted />
    </header>
  );
};

export default Header;
