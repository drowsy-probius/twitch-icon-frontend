import React from "react";
import { IconMetatdata, IconStats } from "../../@types";

interface StatsInterface
{
  data: IconMetatdata
  stats: IconStats
}

function StatsList(props: StatsInterface)
{
  console.log(props);

  return (
    <div></div>
  )
}

export default StatsList;