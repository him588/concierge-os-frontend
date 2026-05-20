"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import Modal from "@/components/common/modal";
import { ServiceContextType } from "@/components/types/types";
import CreateService from "@/features/services/service/create-service";
import CreateStaff from "@/features/services/staff/create-staff";

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiveContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<"Services" | "Staff">("Services");
  const [serviceModal, setServiceModal] = useState<"Services" | "Staff" | null>(
    null,
  );

  const contextValue: ServiceContextType = useMemo(() => {
    return {
      activeTab,
      setActiveTab,
      serviceModal,
      setServiceModal,
    };
  }, [activeTab, serviceModal]);

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
      {serviceModal && (
        <Modal
          modalBoxClassName="rounded-[1.6rem] p-[.5rem]"
          isOpen={serviceModal !== null}
          onClose={() => setServiceModal(null)}
          titleClass="text-center text-[#1c1d4e]  text-[1.4rem] font-semibold"
        >
          {serviceModal === "Services" ? (
            <CreateService onClose={() => setServiceModal(null)} />
          ) : (
            <CreateStaff onClose={() => setServiceModal(null)} />
          )}
        </Modal>
      )}
    </ServiceContext.Provider>
  );
};

export function useServiceContext() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error(
      "useServiceContext must be used within a ServiceContextProvider",
    );
  }
  return context;
}
