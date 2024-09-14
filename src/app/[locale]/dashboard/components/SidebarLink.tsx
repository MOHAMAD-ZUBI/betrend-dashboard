"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

type SidebarLinkProps = {
  path: string;
  Icon: any;
  title: string;
};

const SidebarLink: FC<SidebarLinkProps> = ({ Icon, path, title }) => {
  const pathname = usePathname();
  console.log(pathname);
  const isActive = (path: string) => {
    if (pathname === path) {
      return " bg-primaryDashboard text-white  ";
    }
  };
  return (
    <Link
      href={path}
      className={cn(
        "text-black group font-[450] text-[18px] flex flex-row items-center justify-between px-4 py-3 rounded-2xl duration-300 hover:bg-primaryDashboard hover:text-white ",
        isActive(path)
      )}
    >
      <div className="flex flex-row items-center gap-x-2">
        <Icon />
        <div>{title}</div>
      </div>
      <div className=" group-hover:opacity-100  opacity-0 duration-500">
        <MdOutlineKeyboardArrowRight color="white" size={25} />
      </div>
    </Link>
  );
};

export default SidebarLink;
