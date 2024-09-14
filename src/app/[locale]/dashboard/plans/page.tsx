import client from "@/utils/client";
import React from "react";
import PlansTable from "./components/PlansTable";

type Props = {};

const page = async (props: Props) => {
  const { data } = await client.get("/plans/");
  return (
    <div>
      <PlansTable apiData={data} />
    </div>
  );
};

export default page;
