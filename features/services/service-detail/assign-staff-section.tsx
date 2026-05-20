"use client";
import { useEffect, useState } from "react";
import { Plus, X, User, Mail, Phone } from "lucide-react";
import { Staff } from "../types/types";
import Modal from "@/components/common/modal";
import AssignStaffModal from "./assign-staff-modal";
import {
  useDeleteStaffFromService,
  useGetStaffListInfinite,
} from "../hooks/use-api";
import { useUIContext } from "@/context/ui-context";
import { returnAxiosError } from "@/components/helper/axios";

// Dummy assigned staff

function AssignedStaffSection({ serviceId }: { serviceId: string }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { setToastMessage, setToastType } = useUIContext();
  const {
    data: staffData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetStaffListInfinite(3, "include", "", serviceId);
  const { mutate: deleteStaff } = useDeleteStaffFromService();

  const staffList = staffData?.staffList || [];
  const totalEntries = staffData?.pagination?.total || 0;

  useEffect(() => {
    console.log("staff data", staffData);
  }, [staffData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">
            Assigned Staff
          </h3>
          <p className="text-sm text-stone-600 mt-0.5">
            {totalEntries} staff member
            {totalEntries > 0 ? "s" : ""} assigned
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
        >
          <Plus size={16} />
          Assign Staff
        </button>
      </div>
      {!isLoading && (
        <div className="grid gap-3">
          {!staffList || staffList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center">
                <User className="text-stone-400" size={24} />
              </div>
              <p className="text-stone-600 text-sm">No staff assigned yet</p>
              <p className="text-stone-500 text-xs mt-1">
                Assign staff members to this service
              </p>
            </div>
          ) : (
            staffList.map((staff: Staff) => (
              <div
                key={staff.staffId}
                className="bg-white rounded-lg border border-stone-200 p-4 hover:border-amber-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-stone-900">
                        {staff.name}
                      </h4>
                      {staff.isAvailable ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-600">
                          Busy
                        </span>
                      )}
                      {!staff.isActive && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-stone-600">
                      {staff.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} className="text-stone-400" />
                          <span className="truncate">{staff.email}</span>
                        </div>
                      )}
                      {staff.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-stone-400" />
                          <span>{staff.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteStaff(
                        { staffId: staff.staffId, serviceId },
                        {
                          onSuccess: () => {
                            setToastMessage(
                              "Staff member removed from service. They will complete existing assigned tasks but receive no new assignments.",
                            );
                            setToastType("success");
                          },
                          onError: (err) => {
                            const error = returnAxiosError(err);
                            setToastMessage(error);
                            setToastType("error");
                          },
                        },
                      );
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {hasNextPage && (
        <p
          onClick={() => fetchNextPage()}
          className="text-center text-sm font-semibold cursor-pointer text-stone-500 hover:text-stone-600"
        >
          {isFetchingNextPage ? "Viewing..." : "View More"}
        </p>
      )}

      <Modal
        isOpen={showAddModal}
        modalBoxClassName="w-[40vw]"
        onClose={() => setShowAddModal(false)}
      >
        <AssignStaffModal
          serviceId={serviceId}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
}

export default AssignedStaffSection;
