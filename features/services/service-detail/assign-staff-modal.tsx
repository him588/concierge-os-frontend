import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { Staff } from "../types/types";
import {
  useAssignStaffToService,
  useGetStaffListInfinite,
} from "../hooks/use-api";
import { useUIContext } from "@/context/ui-context";
import { returnAxiosError } from "@/components/helper/axios";

function AssignStaffModal({
  onClose,
  serviceId,
}: {
  onClose: () => void;
  serviceId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setToastMessage, setToastType } = useUIContext();
  const { data, isLoading } = useGetStaffListInfinite(
    3,
    "exclude",
    searchQuery,
    serviceId,
  );
  const { mutate: assignStaff } = useAssignStaffToService();
  const staffList = data?.staffList || [];

  return (
    <div className="bg-white rounded-lg transition-all duration-200  w-full max-h-[80vh] overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">
          Assign Staff to Service
        </h3>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search staff members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-stone-800 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
          />
        </div>
      </div>

      <div className="p-6 overflow-y-auto max-h-96 space-y-2">
        {isLoading ? (
          <>
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-stone-100 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-stone-200 flex-shrink-0" />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-32" />
                  <div className="h-3 bg-stone-200 rounded w-48" />
                </div>

                <div className="w-[18px] h-[18px] bg-stone-200 rounded" />
              </div>
            ))}
          </>
        ) : staffList.length === 0 ? (
          <p className="text-center flex items-center justify-center text-stone-500 text-sm h-20">
            {searchQuery
              ? "No staff members found"
              : "All staff are already assigned"}
          </p>
        ) : (
          staffList.map((staff: Staff) => (
            <button
              key={staff.staffId}
              onClick={() => {
                assignStaff(
                  {
                    isActive: true,
                    serviceId: serviceId,
                    staffId: staff.staffId,
                  },
                  {
                    onSuccess: () => {
                      setToastType("success");
                      setToastMessage("Staff assigned successfully");
                    },
                    onError: (error) => {
                      const err = returnAxiosError(error);
                      setToastMessage(err);
                      setToastType("success");
                    },
                  },
                );
                setSearchQuery("");
              }}
              className="w-full cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-400 to-stone-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900 text-sm">
                    {staff.name}
                  </p>
                  {!staff.isActive && (
                    <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                      Inactive
                    </span>
                  )}
                </div>
                {staff.email && (
                  <p className="text-xs text-stone-600 truncate">
                    {staff.email}
                  </p>
                )}
              </div>

              <Plus size={18} className="text-amber-600" />
            </button>
          ))
        )}
      </div>

      <div className="p-6 border-t border-stone-200">
        <button
          onClick={() => {
            onClose();
            setSearchQuery("");
          }}
          className="w-full px-4 py-2 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AssignStaffModal;
