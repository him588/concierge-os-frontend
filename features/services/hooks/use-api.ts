import {
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getServicesInfo,
  getStaffInfo,
  createService,
  createStaff,
  getStaffList,
  getServiceDetails,
  updateServiceStatus,
  createSubServiceItem,
  getSubServiceItem,
  updateServiceItem,
  deleteServiceItem,
  getServiceStaffList,
  assignStaff,
  assignStaffToService,
  deleteStaffFromStaff,
} from "../api/api";
import { CreateStaff, ServiceItem, Services } from "../types/types";

export const useGetServices = (status: "Active" | "Inactive") => {
  return useQuery({
    queryKey: ["services", status],
    queryFn: () => getServicesInfo(status),
    select: (data) => {
      console.log("services", data.data.services);
      return data.data.services ?? [];
    },
  });
};

export const useGetStaff = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => getStaffInfo(),
    select: (data) => data.data.staffInfo,
  });
};

export const useCreateServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: Services) => createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffDetails: CreateStaff) => createStaff(staffDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
  });
};

export const useGetServiceDetails = (serviceId: string) => {
  return useQuery({
    queryKey: ["serviceDetails", serviceId],
    queryFn: () => getServiceDetails(serviceId),
    select: (data) => data.data.service,
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      markActive,
    }: {
      serviceId: string;
      markActive: boolean;
    }) => updateServiceStatus(serviceId, markActive),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceDetails", variable.serviceId],
      });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useCreateServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceItem: ServiceItem) => createSubServiceItem(serviceItem),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceDetails", variable.serviceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sub-service", variable.serviceId],
      });
    },
  });
};

export const useGetSubServices = (serviceId: string) => {
  return useQuery({
    queryKey: ["sub-service", serviceId],
    queryFn: () => getSubServiceItem(serviceId),
    select: (data): ServiceItem[] => {
      const serviceItem = data?.data?.subServices ?? [];

      return serviceItem.map((item) => ({
        name: item.name ?? "Unknown",
        description: item.description ?? "",
        serviceId: item.id ?? "",
        price: item.price ?? 0,
        isAvailable: item.isAvailable ?? false,
        listingType: item.listingType ?? "default",
      }));
    },
  });
};

export const useUpdateServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      serviceItemId,
      markUnavailable,
    }: {
      serviceId: string;
      serviceItemId: string;
      markUnavailable: boolean;
    }) => updateServiceItem(serviceItemId, markUnavailable),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["sub-service", variable.serviceId],
      });
    },
  });
};

export const useDeleteServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      serviceItemId,
    }: {
      serviceId: string;
      serviceItemId: string;
    }) => deleteServiceItem(serviceItemId),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["sub-service", variable.serviceId],
      });
    },
  });
};

export const useGetStaffServiceList = (serviceId: string) => {
  return useQuery({
    queryKey: ["staff-service-map", serviceId],
    queryFn: () => getServiceStaffList(serviceId),
    select: (data) => {
      console.log(data);
      return data?.data?.data ?? [];
    },
  });
};

export const useAssignStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      staffid,
    }: {
      serviceId: string;
      staffid: string;
    }) => {
      return assignStaff(serviceId, staffid);
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceDetails", variable.serviceId],
      });
    },
  });
};

export const useAssignStaffToService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignStaffToService,
    onSuccess: () => {
      // invalidate relevant queries so UI updates
      queryClient.invalidateQueries({
        queryKey: ["staff-service-mappings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["staffList"],
        refetchType: "active",
      });
    },
  });
};

export const useGetStaffListInfinite = (
  pageSize: number,
  staffType: "include" | "exclude" | "all",
  search?: string,
  serviceId?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["staffList", pageSize, search, staffType, serviceId],
    queryFn: ({ pageParam = 1 }) =>
      getStaffList({
        pageSize,
        pageNo: pageParam,
        search,
        staffType,
        serviceId,
      }),
    getNextPageParam: (lastPage) => {
      const { pageNo, totalPages } = lastPage?.data?.pagination ?? {};
      // Return next page number if there are more pages, otherwise undefined
      return pageNo < totalPages ? pageNo + 1 : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      // Flatten all pages into a single array
      staffList: data.pages.flatMap((page) => page?.data?.staff ?? []),
      // Keep pagination info from the last page
      pagination: data.pages[data.pages.length - 1]?.data?.pagination ?? {
        total: 0,
        totalPages: 1,
      },
      // Expose pages if you need them separately
      pages: data.pages,
    }),
  });
};

export const useDeleteStaffFromService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaffFromStaff,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["staffList"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceDetails", variable.serviceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceDetails", variable.serviceId],
      });
    },
  });
};
