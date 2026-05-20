/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useServiceContext } from "@/context/service-context";
import EmptyState from "./empty-state";
import { useGetStaff } from "../hooks/use-api";
import StaffPage from "./staff-page";

function Staff() {
  const { setServiceModal } = useServiceContext();
  const { data, isLoading, isError } = useGetStaff();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching staff</div>;

  return (
    <section className=" h-[100%]">
      {data.totalStaff === 0 ? (
        <EmptyState
          title="Don't have any staff "
          description="This property doesn’t have any Staff yet. Start by adding one."
          buttonText="+ Add Staff"
          className=""
          onButtonClick={() => setServiceModal("Staff")}
        />
      ) : (
        <StaffPage
          // staff={data?.data.staff}
          onAddStaff={() => setServiceModal("Staff")}
          // onEdit={(s) => setEditTarget(s)}
          // onToggleAvailability={(id) => mutate({ id, field: "isAvailable" })}
          // onToggleActive={(id) => mutate({ id, field: "isActive" })}
          // onDelete={(id) => deleteStaff(id)}
        />
      )}
    </section>
  );
}

export default Staff;
