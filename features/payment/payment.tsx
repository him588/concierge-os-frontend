/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "@/components/helper/jwt";
import { usePaymentInfo } from "./hook/use-api";
import { formatDate } from "@/components/helper/common";
import { usePayment } from "@/context/payment-context";
import { LinkExpired } from "./components/link-expired";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage({ id }: { id: string }) {
  const router = useRouter();
  const [linkExpired, setLinkExpired] = useState(false);
  const { data, error: fetchDataError, isLoading } = usePaymentInfo(id);
  const [errors, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const {
    paymentInfo,
    setPaymentInfo,
    setPaymentType,
    paymentType,
    servicePaymentInfo,
    setServicePaymentInfo,
  } = usePayment();

  useEffect(() => {
    console.log("all the service payments", servicePaymentInfo);
  }, [servicePaymentInfo]);

  useEffect(() => {
    try {
      if (!isTokenValid(id)) {
        setLinkExpired(true);
        return;
      }

      if (data?.data?.paymentDetails) {
        const paymentData = data.data.paymentDetails;

        if (paymentData.bookingType === "service") {
          setPaymentType("serviceBooking");
          setServicePaymentInfo({
            guestName: paymentData.guestId?.name || "",
            guestEmail: paymentData.guestId?.email || "",
            services: paymentData.services.map((s: any) => ({
              bookingId: s.bookingId || "",
              serviceName: s.serviceName || "",
              description: s.description || "",
              listingType: s.listingType || "quantity",
              quantity: s.quantity ?? 1,
              price: s.price ?? 0,
              totalAmount: s.totalAmount ?? 0,
              status: s.status || "",
              scheduledAt: s.scheduledAt ?? null,
              notes: s.notes ?? null,
            })),
            grandTotal: paymentData.grandTotal,
            orderId: paymentData.orderId,
            paymentSecret: paymentData.orderKey,
          });
        } else {
          setPaymentType("roomBooking");
          setPaymentInfo({
            bookingId: paymentData._id || "",
            roomType: paymentData.roomTypeId?.type || "",
            totalNights: paymentData.totalNights?.toString() || "",
            pricePerNight: paymentData.pricePerNight?.toString() || "",
            checkInDate: formatDate(paymentData.checkIn) || "",
            checkOutDate: formatDate(paymentData.checkOut) || "",
            guestName: paymentData.guestId?.name || "",
            guestEmail: paymentData.guestId?.email || "",
            totalAmount: paymentData.totalAmount?.toString() || "",
            roomNumber: paymentData.roomId?.roomNumber || "",
            orderId: paymentData.orderId,
            paymentSecret: paymentData.orderKey,
          });
        }
      }
    } catch (error) {
      console.error("Error processing payment data:", error);
      setLinkExpired(true);
    }
  }, [id, data, setPaymentInfo, setPaymentType, setServicePaymentInfo]);

  const handlePayment = () => {
    const isService = paymentType === "serviceBooking";
    const info = isService ? servicePaymentInfo : paymentInfo;
    if (!info) return;

    const amount = isService
      ? servicePaymentInfo!.grandTotal
      : Number(paymentInfo.totalAmount);

    const description = isService
      ? `${servicePaymentInfo!.services.length} Service${servicePaymentInfo!.services.length > 1 ? "s" : ""}`
      : `${paymentInfo.roomNumber} - ${paymentInfo.totalNights} Night${+paymentInfo.totalNights > 1 ? "s" : ""}`;

    const options = {
      key: isService
        ? servicePaymentInfo!.paymentSecret
        : paymentInfo.paymentSecret,
      amount,
      currency: "INR",
      name: "Hotel Booking",
      description,
      order_id: isService ? servicePaymentInfo!.orderId : paymentInfo.orderId,
      handler: async function () {
        router.push(`/payment/success`);
      },
      prefill: {
        name: isService ? servicePaymentInfo!.guestName : paymentInfo.guestName,
        email: isService
          ? servicePaymentInfo!.guestEmail
          : paymentInfo.guestEmail,
      },
      notes: isService
        ? {
            bookingIds: servicePaymentInfo!.services
              .map((s) => s.bookingId)
              .join(","),
          }
        : { bookingId: paymentInfo.bookingId },
      theme: { color: "#f59e0b" },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      setError(`Payment failed: ${response.error.description}`);
      setProcessing(false);
    });
    rzp.open();
  };

  if (linkExpired) return <LinkExpired />;

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#fffbf5" }}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div
            className="bg-white rounded-2xl shadow-sm border"
            style={{ borderColor: "#e7e5e4" }}
          >
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="h-8 rounded shimmer"></div>
                <div className="h-24 rounded shimmer"></div>
                <div className="h-12 rounded shimmer"></div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shimmer {
            background: linear-gradient(
              90deg,
              #f5ede0 0%,
              #fef3c7 50%,
              #f5ede0 100%
            );
            background-size: 600px 100%;
            animation: shimmer 1.6s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% {
              background-position: -600px 0;
            }
            100% {
              background-position: 600px 0;
            }
          }
        `}</style>
      </div>
    );
  }

  if (fetchDataError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffbf5" }}
      >
        <div className="max-w-md mx-auto px-4">
          <div
            className="bg-white rounded-2xl shadow-sm border p-8 text-center"
            style={{ borderColor: "#fca5a5" }}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#fff5f5" }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#ef4444" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: "#1c1917" }}
            >
              Payment Error
            </h2>
            <p className="mb-6" style={{ color: "#57534e" }}>
              {fetchDataError.message}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                color: "white",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentType === "none") return null;

  // ─── Service Booking UI ───────────────────────────────────────────────────────
  if (paymentType === "serviceBooking" && servicePaymentInfo) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#fffbf5" }}>
        <div className="fixed inset-0 pointer-events-none bg-mesh"></div>

        <div className="relative max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 gradient-amber">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#1c1917" }}
            >
              Complete Your Payment
            </h1>
            <p style={{ color: "#57534e" }}>
              Secure payment powered by Razorpay
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            style={{ borderColor: "#e7e5e4" }}
          >
            {/* Header */}
            <div className="px-8 py-6 gradient-header">
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "#1c1917" }}
              >
                Service Summary
              </h2>
              <p className="text-sm" style={{ color: "#78716c" }}>
                {servicePaymentInfo.services.length} service
                {servicePaymentInfo.services.length > 1 ? "s" : ""} requested
              </p>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Services list */}
              <div className="space-y-3">
                {servicePaymentInfo.services.map((service, index) => (
                  <div
                    key={service.bookingId || index}
                    className="flex items-start justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "#f5f5f4" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#fef3c7" }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: "#d97706" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: "#1c1917" }}
                        >
                          {service.serviceName}
                        </p>
                        {service.description && (
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#a8a29e" }}
                          >
                            {service.description}
                          </p>
                        )}
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#78716c" }}
                        >
                          {service.listingType === "quantity"
                            ? `Qty: ${service.quantity}`
                            : `${service.quantity} person${service.quantity > 1 ? "s" : ""}`}
                          {service.scheduledAt && (
                            <span className="ml-2">
                              · {formatDate(service.scheduledAt)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold" style={{ color: "#d97706" }}>
                        ₹{service.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: "#a8a29e" }}>
                        ₹{service.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guest Info */}
              <div className="pt-4 border-t" style={{ borderColor: "#f5f5f4" }}>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "#78716c" }}
                >
                  Guest Details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      style={{ color: "#a8a29e" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p style={{ color: "#44403c" }}>
                      {servicePaymentInfo.guestName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      style={{ color: "#a8a29e" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p style={{ color: "#44403c" }}>
                      {servicePaymentInfo.guestEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div
                className="pt-6 border-t-2"
                style={{ borderColor: "#e7e5e4" }}
              >
                <div className="space-y-3 mb-4">
                  {servicePaymentInfo.services.map((service, index) => (
                    <div
                      key={service.bookingId || index}
                      className="flex justify-between"
                    >
                      <p style={{ color: "#57534e" }}>
                        {service.serviceName} × {service.quantity}
                      </p>
                      <p style={{ color: "#44403c" }}>
                        ₹{service.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <p style={{ color: "#57534e" }}>Taxes & Fees</p>
                    <p style={{ color: "#44403c" }}>Included</p>
                  </div>
                </div>
                <div
                  className="flex justify-between items-center pt-4 border-t-2"
                  style={{ borderColor: "#f5f5f4" }}
                >
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#1c1917" }}
                  >
                    Total Amount
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#d97706" }}
                  >
                    ₹{servicePaymentInfo.grandTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Security Note */}
              <div
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fde68a",
                }}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#d97706" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "#78350f" }}
                  >
                    Secure Payment
                  </p>
                  <p className="text-xs" style={{ color: "#92400e" }}>
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div
              className="px-8 py-6"
              style={{
                backgroundColor: "#fafaf9",
                borderTop: "1px solid #e7e5e4",
              }}
            >
              <button
                onClick={handlePayment}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed btn-payment"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Pay ₹{servicePaymentInfo.grandTotal.toLocaleString()}{" "}
                    Securely
                  </span>
                )}
              </button>
              <p
                className="text-center text-xs mt-3"
                style={{ color: "#78716c" }}
              >
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div
            className="mt-8 flex items-center justify-center gap-6 text-sm flex-wrap"
            style={{ color: "#78716c" }}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                style={{ color: "#10b981" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                style={{ color: "#10b981" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                style={{ color: "#10b981" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>

        <style jsx>{`
          .bg-mesh {
            background:
              radial-gradient(
                at 15% 20%,
                rgba(251, 191, 36, 0.13) 0,
                transparent 55%
              ),
              radial-gradient(
                at 85% 10%,
                rgba(167, 198, 172, 0.18) 0,
                transparent 50%
              ),
              radial-gradient(
                at 60% 85%,
                rgba(251, 191, 36, 0.08) 0,
                transparent 45%
              ),
              radial-gradient(
                at 5% 80%,
                rgba(167, 198, 172, 0.12) 0,
                transparent 50%
              );
          }
          .gradient-amber {
            background: linear-gradient(135deg, #fbbf24, #d97706);
          }
          .gradient-header {
            background: linear-gradient(145deg, #fefce8, #fff7ed);
            border-bottom: 1px solid #e7e5e4;
          }
          .btn-payment {
            background: linear-gradient(135deg, #f59e0b, #f97316);
          }
          .btn-payment:not(:disabled):hover {
            transform: scale(1.02);
          }
          .btn-payment:disabled {
            background: #a8a29e;
            transform: scale(0.98);
          }
        `}</style>
      </div>
    );
  }

  // ─── Room Booking UI (unchanged) ─────────────────────────────────────────────
  if (!paymentInfo) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fffbf5" }}>
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none bg-mesh"></div>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 gradient-amber">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1c1917" }}>
            Complete Your Payment
          </h1>
          <p style={{ color: "#57534e" }}>Secure payment powered by Razorpay</p>
        </div>

        {/* Payment Card */}
        <div
          className="bg-white rounded-2xl shadow-sm border overflow-hidden"
          style={{ borderColor: "#e7e5e4" }}
        >
          {/* Booking Summary Header */}
          <div className="px-8 py-6 gradient-header">
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: "#1c1917" }}
            >
              Booking Summary
            </h2>
            <p className="text-sm" style={{ color: "#78716c" }}>
              Booking ID: {paymentInfo.bookingId}
            </p>
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-6">
            {/* Room Type */}
            <div
              className="flex items-start justify-between pb-4 border-b"
              style={{ borderColor: "#f5f5f4" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fef3c7" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#d97706" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#1c1917" }}>
                    {paymentInfo.roomType}
                  </p>
                  <p className="text-sm" style={{ color: "#78716c" }}>
                    {paymentInfo.totalNights} Night
                    {+paymentInfo.totalNights > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="font-semibold" style={{ color: "#d97706" }}>
                ₹{paymentInfo.pricePerNight}/night
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#78716c" }}
                >
                  Room Number
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#a8a29e" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium" style={{ color: "#44403c" }}>
                    {paymentInfo.roomNumber}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#78716c" }}
                >
                  Check-in
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#a8a29e" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium" style={{ color: "#44403c" }}>
                    {paymentInfo.checkInDate}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#78716c" }}
                >
                  Check-out
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#a8a29e" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-medium" style={{ color: "#44403c" }}>
                    {formatDate(paymentInfo.checkOutDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="pt-4 border-t" style={{ borderColor: "#f5f5f4" }}>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#78716c" }}
              >
                Guest Details
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#a8a29e" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p style={{ color: "#44403c" }}>{paymentInfo.guestName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    style={{ color: "#a8a29e" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p style={{ color: "#44403c" }}>{paymentInfo.guestEmail}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-6 border-t-2" style={{ borderColor: "#e7e5e4" }}>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <p style={{ color: "#57534e" }}>
                    Room × {paymentInfo.totalNights} night
                    {+paymentInfo.totalNights > 1 ? "s" : ""}
                  </p>
                  <p style={{ color: "#44403c" }}>
                    ₹{paymentInfo.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p style={{ color: "#57534e" }}>Taxes & Fees</p>
                  <p style={{ color: "#44403c" }}>Included</p>
                </div>
              </div>
              <div
                className="flex justify-between items-center pt-4 border-t-2"
                style={{ borderColor: "#f5f5f4" }}
              >
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#1c1917" }}
                >
                  Total Amount
                </p>
                <p className="text-2xl font-bold" style={{ color: "#d97706" }}>
                  ₹{paymentInfo.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
              }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#d97706" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#78350f" }}
                >
                  Secure Payment
                </p>
                <p className="text-xs" style={{ color: "#92400e" }}>
                  Your payment information is encrypted and secure. We never
                  store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div
            className="px-8 py-6"
            style={{
              backgroundColor: "#fafaf9",
              borderTop: "1px solid #e7e5e4",
            }}
          >
            <button
              onClick={handlePayment}
              // disabled={processing}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed btn-payment"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Pay ₹{paymentInfo.totalAmount.toLocaleString()} Securely
                </span>
              )}
            </button>
            <p
              className="text-center text-xs mt-3"
              style={{ color: "#78716c" }}
            >
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          className="mt-8 flex items-center justify-center gap-6 text-sm flex-wrap"
          style={{ color: "#78716c" }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              style={{ color: "#10b981" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              style={{ color: "#10b981" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              style={{ color: "#10b981" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-mesh {
          background:
            radial-gradient(
              at 15% 20%,
              rgba(251, 191, 36, 0.13) 0,
              transparent 55%
            ),
            radial-gradient(
              at 85% 10%,
              rgba(167, 198, 172, 0.18) 0,
              transparent 50%
            ),
            radial-gradient(
              at 60% 85%,
              rgba(251, 191, 36, 0.08) 0,
              transparent 45%
            ),
            radial-gradient(
              at 5% 80%,
              rgba(167, 198, 172, 0.12) 0,
              transparent 50%
            );
        }
        .gradient-amber {
          background: linear-gradient(135deg, #fbbf24, #d97706);
        }
        .gradient-header {
          background: linear-gradient(145deg, #fefce8, #fff7ed);
          border-bottom: 1px solid #e7e5e4;
        }
        .btn-payment {
          background: linear-gradient(135deg, #f59e0b, #f97316);
        }
        .btn-payment:not(:disabled):hover {
          transform: scale(1.02);
        }
        .btn-payment:disabled {
          background: #a8a29e;
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
