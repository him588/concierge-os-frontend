import apiClient from "@/components/api/service-provider";
import { CreateStaff, ServiceItem, Services, Staff } from "../types/types";

export async function getServicesInfo(status: "Active" | "Inactive") {
  return apiClient.get("/services", {
    params: {
      status,
    },
  });
}

export async function getStaffInfo() {
  return apiClient.get("/staff");
}

export async function createService(serviceData: Services) {
  return apiClient.post("/services/", { ...serviceData });
}

export async function createStaff(staff: CreateStaff) {
  return apiClient?.post("/staff", { ...staff });
}

export async function getStaffList({
  search,
  pageSize,
  pageNo,
  staffType,
  serviceId,
}: {
  search?: string;
  pageSize: number;
  pageNo: number;
  staffType: "include" | "exclude" | "all";
  serviceId?: string;
}) {
  return apiClient.get("/staff/staff-list", {
    params: {
      search,
      pageSize,
      pageNo,
      staffType,
      serviceId,
    },
  });
}

export async function getServiceDetails(serviceId: string) {
  return apiClient.get(`/services/${serviceId}`);
}

export async function updateServiceStatus(
  serviceId: string,
  markActive: boolean,
) {
  return apiClient.put(`/services/${serviceId}`, { markActive, id: serviceId });
}

export async function createSubServiceItem(serviceItem: ServiceItem) {
  return apiClient.post(`service-items`, { ...serviceItem });
}

export async function getSubServiceItem(serviceItem: string) {
  return apiClient.get(`service-items`, {
    params: {
      serviceItem,
    },
  });
}

export async function updateServiceItem(
  serviceItem: string,
  markUnavailable: boolean,
) {
  return apiClient.put(`service-items/${serviceItem}`, { markUnavailable });
}

export async function deleteServiceItem(serviceItem: string) {
  return apiClient.delete(`service-items/${serviceItem}`);
}

export async function getServiceStaffList(serviceId: string) {
  return apiClient.get(`/staff-service-mappings/${serviceId}`);
}

export async function assignStaff(serviceId: string, staffId: string) {
  return apiClient.post("/staff-service-mappings", { serviceId, staffId });
}

export async function assignStaffToService({
  staffId,
  serviceId,
  isActive,
}: {
  staffId: string;
  serviceId: string;
  isActive: boolean;
}) {
  return apiClient.post("/staff-service-mappings", {
    serviceId,
    staffId,
    isActive,
  });
}

export async function deleteStaffFromStaff({
  staffId,
  serviceId,
}: {
  staffId: string;
  serviceId: string;
}) {
  return apiClient.delete(`/staff-service-mappings/${staffId}`, {
    params: {
      staffId,
      serviceId,
    },
  });
}
