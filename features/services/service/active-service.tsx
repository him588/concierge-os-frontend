import React, { useEffect, useMemo, useState } from "react";
import { Users, Layers, Wrench } from "lucide-react";
import CreateCard from "@/features/rooms/components/create-card";
import { useRouter } from "next/navigation";
import { useServiceContext } from "@/context/service-context";
import { useGetServices } from "../hooks/use-api";
import RecentServices from "./recent-services";
import DropDown from "@/components/common/drop-down";

export interface Services {
  serviceId: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  serviceCount: number;
  staffCount: number;
}

interface ActiveServiceProps {
  filter: "Active" | "Inactive";
  setFilter: React.Dispatch<React.SetStateAction<"Active" | "Inactive">>;
}

function ActiveService({ filter, setFilter }: ActiveServiceProps) {
  const dropDownValue = [
    { key: "Active", value: "Active" },
    { key: "Inactive", value: "Inactive" },
  ];
  const router = useRouter();
  const { data: services, isError, isLoading } = useGetServices(filter);
  const { setServiceModal } = useServiceContext();
  useEffect(() => {
    console.log({ services });
  }, [services]);

  if (isLoading) return <div>Loading...</div>;

  // ✅ error guard
  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Left Section */}
      {}
      <div className="w-full space-y-4 mt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[1.5rem] font-semibold text-[#151a2c]">Services</p>
          <DropDown
            data={dropDownValue}
            defaultSelect={true}
            handleClick={(val) => setFilter(val as "Active" | "Inactive")}
          />
        </div>

        {/* Services Grid */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {/* Add New Service Card */}
          <CreateCard
            title="Add Service"
            description="Add a new service"
            icon={Wrench}
            accentColor="#4c6edb"
            backgroundColor="#eef3ff"
            onClick={() => setServiceModal("Services")}
            className="h-[150px] w-full"
          />

          {/* Service Cards */}
          {services &&
            services.map((service: Services) => (
              <div
                key={service.serviceId}
                onClick={() => router.push(`/services/${service.serviceId}`)}
                className="relative h-[150px] rounded-xl p-4
               flex flex-col justify-between cursor-pointer
               transition hover:-translate-y-0.5
               border border-black/5 hover:shadow-md"
                style={{ backgroundColor: service.color }}
              >
                {/* Left Accent */}
                <div className="absolute left-0 top-0 h-full w-[4px] rounded-l-xl bg-black/10" />

                {/* Top Content */}
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="min-h-9 min-w-9 rounded-lg bg-black/5 flex items-center justify-center">
                    <Layers size={16} className="text-[#151a2c]" />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-[#151a2c]">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 break-words">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                  {/* Counts */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="font-medium text-[#151a2c]">
                        {service.staffCount}
                      </span>
                      <span>Staff</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Layers size={14} />
                      <span className="font-medium text-[#151a2c]">
                        {service.serviceCount}
                      </span>
                      <span>Sub</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`text-[11px] px-2 py-[2px] rounded-full font-medium
          ${
            service.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
                  >
                    {service.isActive ? "Active" : "InActive"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <RecentServices />
    </div>
  );
}

export default ActiveService;
