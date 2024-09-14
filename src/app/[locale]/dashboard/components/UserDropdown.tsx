"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
  Avatar,
} from "@nextui-org/react";

type Props = {};

const UserDropdown = (props: Props) => {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Avatar as="button" src="/user.png" className="transition-transform" />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Action event example"
        onAction={(key) => alert(key)}
      >
        <DropdownItem key="new">Credits</DropdownItem>
        <DropdownItem key="copy">My Resumes</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserDropdown;
