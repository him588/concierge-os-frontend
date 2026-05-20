import ServiceDetail from "@/features/services/service-detail/service-detail";
import React, { use } from "react";

function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  console.log(id);
  return <ServiceDetail id={id} />;
}

export default Page;
