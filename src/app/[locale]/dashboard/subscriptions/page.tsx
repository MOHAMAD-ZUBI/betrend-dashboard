import client from "@/utils/client";
import React from "react";
import SubscriptionsTable from "./components/SubscriptionsTable";

type Props = {};

const page = async (props: Props) => {
  const { data } = await client.get("/subs/");
  return (
    <div>
      <SubscriptionsTable apiData={data} />
    </div>
  );
};

export default page;
