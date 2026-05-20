"use client";
import {
  IndianRupee,
  Package,
  User,
  EllipsisVertical,
  AlertTriangle,
} from "lucide-react";
import {
  useDeleteServiceItem,
  useGetSubServices,
  useUpdateServiceItem,
} from "../hooks/use-api";
import Skeleton from "react-loading-skeleton";
import { ServiceItem } from "../types/types";
import { useState } from "react";
import Modal from "@/components/common/modal";
import { useUIContext } from "@/context/ui-context";

export default function SubServicesSection({
  serviceId,
}: {
  serviceId: string;
}) {
  const { data: subServices, isLoading } = useGetSubServices(serviceId);

  if (isLoading) {
    return (
      <Skeleton
        height={400}
        borderRadius={"2rem"}
        className=" h-[100%] w-[100%] rounded-[2rem]"
      ></Skeleton>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Sub-Services</h3>
        <p className="text-[12px] -mt-[.2rem] text-stone-600 ">
          Manage service items and add-ons
        </p>
      </div>

      <div className="grid gap-3">
        {!subServices || subServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center">
              <IndianRupee className="text-stone-400" size={24} />
            </div>
            <p className="text-stone-600 text-sm">No sub-services available</p>
            <p className="text-stone-500 text-xs mt-1">
              Add service items to get started
            </p>
          </div>
        ) : (
          subServices.map((service) => (
            <ServiceCard
              serviceId={serviceId}
              key={service.serviceId}
              service={service}
            />
          ))
        )}
      </div>
    </div>
  );
}

const ServiceCard = ({
  service,
  serviceId,
}: {
  service: ServiceItem;
  serviceId: string;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowmodal] = useState(false);
  const { mutate: updateServiceItem } = useUpdateServiceItem();
  const { mutate: deleteServiceItem } = useDeleteServiceItem();
  const { setToastMessage, setToastType } = useUIContext();
  function handleUpdateService() {
    updateServiceItem(
      {
        serviceId,
        serviceItemId: service.serviceId,
        markUnavailable: !service.isAvailable,
      },
      {
        onSuccess: () => {
          setToastMessage("Status available successfully.");
          setToastType("success");
        },
        onError: () => {
          setToastMessage("Failed to update service item.");
          setToastType("error");
        },
      },
    );
    setShowMenu(false);
  }
  function handleDeleteService() {
    deleteServiceItem(
      {
        serviceId,
        serviceItemId: service.serviceId,
      },
      {
        onSuccess: () => {
          setToastMessage("Sevice deleted successfully");
          setToastType("success");
        },
        onError: () => {
          setToastMessage("Failed to Delete service item.");
          setToastType("error");
        },
      },
    );
    setShowmodal(false);
  }

  return (
    <div
      onMouseLeave={() => setShowMenu(false)}
      className={`bg-white rounded-lg border border-stone-200 p-3  hover:shadow-sm transition-all group `}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div
            className={`mt-0.5 p-1 rounded ${
              service.listingType === "person"
                ? "bg-purple-50 text-purple-600"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {service.listingType === "person" ? (
              <User size={14} strokeWidth={2} />
            ) : (
              <Package size={14} strokeWidth={2} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-stone-900 text-sm leading-tight mb-1 truncate">
              {service.name}
            </h4>
            <span
              className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${
                service.listingType === "person"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {service.listingType === "person" ? "Per person" : "By quantity"}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={`"p-1 flex items-center cursor-pointer justify-center  h-5 w-5 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 ${showMenu ? "opacity-100 bg-red-50 text-red-600" : "text-stone-400"}`}
          >
            <EllipsisVertical size={16} strokeWidth={2} />
          </button>
          {showMenu && (
            <div className="absolute w-[110px] bg-white rounded-lg border border-stone-200 shadow-lg -left-[90px] top-[2rem] p-1.5 z-10">
              <button
                onClick={handleUpdateService}
                className={`py-1.5 px-2 cursor-pointer rounded-md truncate w-full transition-all text-xs font-medium text-left ${
                  service.isAvailable
                    ? "text-stone-700 hover:bg-stone-50"
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {service.isAvailable ? "Mark unavailable" : "Mark available"}
              </button>

              <button
                onClick={() => setShowmodal(true)}
                className="py-1.5 px-2 cursor-pointer rounded-md w-full transition-all text-xs font-medium text-left text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed mb-2 pl-7 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between pl-7">
        <div className="flex items-baseline gap-0.5">
          <IndianRupee
            size={14}
            className={`${service.listingType === "person" ? "text-purple-700" : "text-amber-600"} `}
            strokeWidth={2.5}
          />
          <span className="text-lg font-semibold text-stone-900">
            {service.price.toLocaleString()}
          </span>
        </div>

        <div
          className={`px-2 py-1 rounded text-xs font-medium ${
            service.isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {service.isAvailable ? "Available" : "Unavailable"}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        modalBoxClassName="w-[40vw]"
        onClose={() => setShowmodal(false)}
      >
        <div className="p-3 ">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-50 rounded-lg">
              <AlertTriangle
                size={20}
                className="text-red-600"
                strokeWidth={2}
              />
            </div>
            <h3 className="text-lg font-semibold text-stone-900">
              Remove <span className="capitalize">{service.name}</span>
            </h3>
          </div>

          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            Are you sure you want to remove? This action cannot be undone.
            Please ensure all existing bookings for this service are completed.
          </p>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setShowmodal(false)}
              className="px-4 py-2 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteService}
              className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Remove service
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
