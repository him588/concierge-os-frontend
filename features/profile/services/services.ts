import apiClient from "@/components/api/service-provider";

export function getPropertyDetails(id: string) {
  return apiClient.get(`/property/property-details/${id}`);
}
