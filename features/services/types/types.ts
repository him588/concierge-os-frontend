export interface Services {
  id?: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  isPaid: boolean;
}

export interface CreateStaff {
  name: string;
  email?: string;
  phone?: string;
  isAvailable: boolean;
  isActive: boolean;
}

export interface AssignedServices {
  color: string;
  description: string;
  name: string;
  serviceId: string;
}

export interface Staff {
  staffId: string;
  name: string;
  email?: string;
  phone?: string;
  hotelId: string;
  isAvailable: boolean;
  isActive: boolean;
  assignedServices?: AssignedServices[];
  createdAt: string;
}

export interface StaffService {
  mappingId: string;
  serviceId: string;
  serviceName: string;
  serviceColor: string;
  isActive: boolean;
}

export enum ListingType {
  QUANTITY = "quantity", // Food, amenities, consumables
  PERSON = "person", // Spa, fitness classes, consultations
}

export interface ServiceItem {
  name: string;
  description: string;
  serviceId: string;
  price: number;
  isAvailable: boolean;
  listingType: ListingType;
}

export enum ServiceBookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ServiceBookings {
  id: string;
  status: ServiceBookingStatus;
  quantity: number;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  serviceItemId: string;
  serviceItemName: string;
  serviceItemPrice: number;
  guestId: string;
  guestName: string;
  guestEmail: string;
  staffId: string | null;
  staffName: string | null;
  staffEmail: string | null;
  roomId: string;
  roomNumber: string;
  roomFloor: string;
}

export type StaffFilter = "all" | "available" | "unavailable";
