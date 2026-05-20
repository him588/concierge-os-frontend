import { useServiceContext } from "@/context/service-context";
import EmptyState from "../staff/empty-state";
import { useGetServices } from "../hooks/use-api";
import ActiveService from "./active-service";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";

function Service() {
  const { setServiceModal } = useServiceContext();
  const [filter, setFilter] = useState<"Active" | "Inactive">("Active");
  const { data, isError, isLoading } = useGetServices(filter);

  if (isLoading) return <ServiceSkeleton />;
  if (isError) return <div>Something went wrong.</div>;

  return (
    <section className=" h-[100%]">
      {data.length === 0 ? (
        <EmptyState
          title="No Services Found"
          description="This property doesn’t have any services yet. Start by adding one."
          buttonText="Add Service"
          className=""
          onButtonClick={() => setServiceModal("Services")}
        />
      ) : (
        <ActiveService filter={filter} setFilter={setFilter} />
      )}
    </section>
  );
}

export default Service;
function ServiceSkeleton() {
  return (
    <div className="w-full space-y-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width={120} height={28} borderRadius={8} />
        <Skeleton width={100} height={36} borderRadius={8} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={150} borderRadius={12} />
        ))}
      </div>
    </div>
  );
}
