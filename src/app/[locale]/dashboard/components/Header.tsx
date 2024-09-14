"use client";
import React, { FC } from "react";
import { HiBars3BottomLeft } from "react-icons/hi2";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
  handleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ handleSidebar }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="md:my-6">
        <button
          className="md:hidden  p-2 bg-white/10 rounded-xl"
          onClick={handleSidebar}
        >
          <HiBars3BottomLeft size={35} />
        </button>
      </div>
    </div>
  );
};

export default Header;
