"use client";
import { Plus, ServerCog, Metronome, ShieldOff } from "lucide-react";
import { useEffect } from "react";
import { useGetServiceDetails, useUpdateService } from "../hooks/use-api";
import Skeleton from "react-loading-skeleton";

function ServiceInfo({ id, isActive }: { id: string; isActive: () => void }) {
  const { data: serviceDetails, isError, isLoading } = useGetServiceDetails(id);
  const { mutate: updateRoomStatus } = useUpdateService();

  useEffect(() => {
    console.log("service details", serviceDetails);
  }, [serviceDetails]);
  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return (
      <Skeleton
        height={150}
        borderRadius={"2rem"}
        className="h-[150px] w-full"
      ></Skeleton>
    );
  }
  return (
    <section>
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mt-5">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 px-6 py-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <ServerCog size={22} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-0.5">
                Service Details
              </p>
              <h1 className="font-playfair text-xl text-amber-100 leading-tight">
                {serviceDetails.name}
              </h1>
            </div>
          </div>

          <div className="flex gap-2 self-start">
            <button
              onClick={() =>
                updateRoomStatus({
                  serviceId: id,
                  markActive: !serviceDetails.isActive,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all
    ${
      serviceDetails.isActive
        ? "text-rose-300 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-200"
        : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-200"
    }`}
            >
              {serviceDetails.isActive ? (
                <>
                  <ShieldOff size={12} />
                  Mark inactive
                </>
              ) : (
                <>
                  <Metronome size={12} />
                  Mark active
                </>
              )}
            </button>

            <button
              onClick={isActive}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-90 transition-all border-0"
            >
              <Plus size={12} />
              Add Subservice
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-100 border-t border-stone-100">
          <StatCell
            label="Total Recieved"
            value={`₹${serviceDetails.totalRevenue}`}
            sub=""
          />
          <StatCell
            label="Total Booked"
            value={String(serviceDetails.totalBookingsCount)}
            sub={"guests"}
          />
          <StatCell
            label="Canceled"
            value={String(serviceDetails.canceledBookingsCount)}
            sub="rooms"
          />
          <StatCell
            label="Staff Assigened"
            value={`${serviceDetails.staffCount}`}
            sub="booked"
          />
        </div>
      </div>
    </section>
  );
}

export default ServiceInfo;

function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold text-stone-800">
        {value}
        {sub && (
          <span className="text-xs font-normal text-stone-400 ml-1">{sub}</span>
        )}
      </p>
    </div>
  );
}
