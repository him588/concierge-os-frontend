"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export interface PaymentInfo {
  bookingId: string;
  roomType: string;
  totalNights: string;
  pricePerNight: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
  totalAmount: string;
  roomNumber: string;
  orderId: string;
  paymentSecret: string;
}

export interface ServiceItem {
  bookingId: string;
  serviceName: string;
  description: string;
  listingType: "quantity" | "person";
  quantity: number;
  price: number;
  totalAmount: number;
  status: string;
  scheduledAt: string | null;
  notes: string | null;
}

export interface ServicePaymentInfo {
  guestName: string;
  guestEmail: string;
  services: ServiceItem[];
  grandTotal: number;
  orderId: string;
  paymentSecret: string;
}

interface PaymentContextValue {
  paymentInfo: PaymentInfo;
  setPaymentInfo: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  servicePaymentInfo: ServicePaymentInfo | null;
  setServicePaymentInfo: React.Dispatch<
    React.SetStateAction<ServicePaymentInfo | null>
  >;
  paymentType: "serviceBooking" | "roomBooking" | "none";
  setPaymentType: React.Dispatch<
    React.SetStateAction<"serviceBooking" | "roomBooking" | "none">
  >;
}

const PaymentContext = createContext<null | PaymentContextValue>(null);

export default function PaymentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    bookingId: "",
    roomType: "",
    totalNights: "",
    pricePerNight: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    totalAmount: "",
    roomNumber: "",
    orderId: "",
    paymentSecret: "",
  });
  const [servicePaymentInfo, setServicePaymentInfo] =
    useState<ServicePaymentInfo | null>(null);
  const [paymentType, setPaymentType] = useState<
    "serviceBooking" | "roomBooking" | "none"
  >("none");

  const contextValue = useMemo(
    () => ({
      paymentInfo,
      setPaymentInfo,
      servicePaymentInfo,
      setServicePaymentInfo,
      paymentType,
      setPaymentType,
    }),
    [paymentInfo, servicePaymentInfo, paymentType],
  );

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const payment = useContext(PaymentContext);
  if (payment === null) {
    throw new Error(
      "usePaymentContext must be used within a RoomContextProvider",
    );
  }
  return payment;
}
