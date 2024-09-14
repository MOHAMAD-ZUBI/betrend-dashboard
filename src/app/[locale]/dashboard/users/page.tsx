import React from "react";
import UsersTable from "./components/UsersTable";
import client from "@/utils/client";

type Props = {};

const page = async (props: Props) => {
  const { data } = await client.get("/auth/");

  return (
    <div>
      <UsersTable apiData={data} />
    </div>
  );
};

export default page;
