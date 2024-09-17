import client from "@/utils/client";
import React from "react";
import JobsTable from "./components/JobsTable";
type Props = {};

const page = async (props: Props) => {
  const { data } = await client.get("/jobs/");

  return (
    <div>
      <JobsTable apiData={data.jobs} />
    </div>
  );
};

export default page;
