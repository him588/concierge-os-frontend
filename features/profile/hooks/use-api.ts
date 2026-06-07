import { useQuery } from "@tanstack/react-query";
import { getPropertyDetails } from "../services/services";

export function useGetPropertyDetails(id: string) {
  return useQuery({
    queryKey: ["propertyDetails", id],
    queryFn: () => getPropertyDetails(id),
  });
}
