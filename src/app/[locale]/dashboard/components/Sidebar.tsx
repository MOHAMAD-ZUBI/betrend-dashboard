"use client";
import React, { FC, useEffect } from "react";
import {
  MdDashboard,
  MdOutlineSettingsSuggest,
  MdBusinessCenter,
  MdClose,
  MdOutlineLogout,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { RiListSettingsFill } from "react-icons/ri";
import { FaEnvelopeOpenText } from "react-icons/fa6";

import { FcWorkflow } from "react-icons/fc";
import { BsStars } from "react-icons/bs";
import SidebarLink from "./SidebarLink";
import { FaCrown } from "react-icons/fa6";
import { RiVipCrown2Fill } from "react-icons/ri";

import { HiDocumentText, HiUsers } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import {
  PiContactlessPaymentFill,
  PiFileJpgBold,
  PiPackageFill,
  PiPackageLight,
} from "react-icons/pi";

interface SidebarProps {
  handleSidebar: () => void;
}

const Links = [
  { title: "Dashboard", icon: MdDashboard, path: "/dashboard" },
  {
    title: "Users",
    icon: HiUsers,
    path: "/en/dashboard/users",
  },
  {
    title: "Plans",
    icon: PiPackageFill,
    path: "/en//dashboard/plans",
  },
  {
    title: "Subscriptions",
    icon: PiContactlessPaymentFill,
    path: "/en//dashboard/subscriptions",
  },
  {
    title: "Jobs",
    icon: PiFileJpgBold,
    path: "/en//dashboard/jobs",
  },
];
const Sidebar: FC<SidebarProps> = ({ handleSidebar }) => {
  return (
    <div className="p-6  bg-background h-full  flex flex-col justify-between min-h-screen    ">
      <div>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="p-3 flex flex-row items-center gap-2 text-primaryDashboard">
            <Image
              src="/betrendlogo.png"
              width={150}
              height={150}
              alt="betrend logo"
            />
          </div>
          <button
            onClick={handleSidebar}
            className="bg-white/20 sm:hidden rounded-xl p-1"
          >
            <MdClose size={23} />
          </button>
        </div>
        <div className="h-[1px] w-full bg-content2 my-8"></div>
        <div className="flex flex-col my-4 gap-2">
          {Links.map((link, index) => {
            return (
              <SidebarLink
                key={index}
                path={link.path}
                title={link.title}
                Icon={link.icon}
              />
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <button
          onClick={() => {
            // signOut();
          }}
          className={
            "text-black group w-full mt-4 font-[450] text-[18px] flex flex-row items-center justify-between px-4 py-3 rounded-2xl duration-300 hover:bg-red-50/50 hover:text-red-400 "
          }
        >
          <div className="flex flex-row items-center gap-x-2">
            <MdOutlineLogout />
            <div>Log out</div>
          </div>
          <div className=" group-hover:opacity-100  opacity-0 duration-500">
            <MdOutlineKeyboardArrowRight className="text-red-400" size={25} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
