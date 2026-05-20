"use client";
import React, { useState } from "react";
import ServiceInfo from "./service-info";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal";
import CreateServiceItem from "./add-sub-service";
import AssignedStaffSection from "./assign-staff-section";
import ServiceBookingsSection from "./service-bookings";
import SubServicesSection from "./sub-service";

function ServiceDetail({ id }: { id: string }) {
  const router = useRouter();
  const [isAddService, setIsAddService] = useState(false);
  return (
    <section>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        <ChevronLeft size={20} />
        Back
      </button>
      <ServiceInfo isActive={() => setIsAddService(true)} id={id} />
      <div className=" space-y-8 mt-8">
        <SubServicesSection serviceId={id} />
        <AssignedStaffSection serviceId={id} />
        <ServiceBookingsSection serviceId={id} />
      </div>

      <Modal onClose={() => setIsAddService(false)} isOpen={isAddService}>
        <CreateServiceItem id={id} onClose={() => setIsAddService(false)} />
      </Modal>
    </section>
  );
}

export default ServiceDetail;
