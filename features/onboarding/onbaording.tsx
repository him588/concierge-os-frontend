"use client";

import { useState, type CSSProperties, JSX } from "react";
import RightPanel from "@/features/onboarding/components/right-panel";
import { PropertyDetails } from "@/features/onboarding/components/types/types";
import { Ic } from "@/features/onboarding/components/icons/icons";
import { subs, tags } from "@/features/onboarding/components/types/const";
import StepFour from "@/features/onboarding/components/step-four";
import StepOne from "@/features/onboarding/components/step-one";
import StepThree from "@/features/onboarding/components/step-three";
import OnboardingForm from "@/features/onboarding/components/onboarding-form";
import { useUIContext } from "@/context/ui-context";
import { useOnboarding } from "./components/hooks/use-onboarding";
import { useBaseContext } from "@/context/base-context";

// ── Validation ────────────────────────────────────────────────────────────────

function validateStep(step: number, details: PropertyDetails): string | null {
  if (step === 1) {
    if (!details.propType) return "Please select a property type to continue.";
  }

  if (step === 2) {
    if (!details.name.trim()) return "Hotel name is required.";
    if (details.description.length < 50 || details.description.length > 100) {
      return "Description must be under 50-100 characters.";
    }
    if (!details.address.trim()) return "Street address  is required.";

    if (!details.city.trim()) return "City is required.";

    if (!details.country.trim()) return "Country is required.";
    if (
      details.phone.length !== 10 ||
      !/^\+?[\d\s\-().]{7,}$/.test(details.phone)
    ) {
      return "Please enter a valid phone number.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email))
      return "Please enter a valid email address.";
  }

  return null;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OnboardingPage(): JSX.Element {
  const [step, setStep] = useState<number>(1);
  const { setToastMessage, setToastType } = useUIContext();
  const { mutateAsync } = useOnboarding();
  const { setUserDetails } = useBaseContext();

  const [details, setDetails] = useState<PropertyDetails>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    propType: null,
  });

  const TOTAL = 4;

  const next = () => {
    const error = validateStep(step, details);
    if (error) {
      setToastType("error");
      setToastMessage(error);
      return;
    }
    if (step < TOTAL) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  async function handleCreateProperty() {
    try {
      await mutateAsync(details, {
        onSuccess: (data) => {
          const property = data.data.property;
          if (property && property?._id && property?.name) {
            setUserDetails((prev) => {
              if (prev === null) {
                return null;
              }
              return { ...prev, name: property.name, propertyId: property._id };
            });
          }
          console.log(data.data.property);
        },
      });
    } catch (error) {
      console.log("Error while creating Property", error);
    }
  }

  const titles = [
    "What kind of property do you run?",
    <>
      Tell us about <em className="not-italic shimmer-text">your property.</em>
    </>,
    <>
      Your <em className="not-italic shimmer-text">command centre</em> is ready.
    </>,
    "You're live on ConciergeOS.",
  ];

  return (
    <div className="bg-mesh font-jakarta min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-5xl bg-white/85 border border-stone-100 rounded-3xl shadow-2xl shadow-stone-200/60 overflow-hidden"
        style={{ backdropFilter: "blur(20px)" } as CSSProperties}
      >
        <div className="grid md:grid-cols-2" style={{ minHeight: "600px" }}>
          {/* ── LEFT ── */}
          <div
            className="flex flex-col px-8 md:px-10 py-4 overflow-y-auto"
            style={{ maxHeight: "90vh" }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 flex-shrink-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-100">
                <Ic.Hotel />
              </div>
              <span className="font-playfair text-lg text-stone-800">
                Concierge<span className="text-amber-500">OS</span>
              </span>
            </div>

            {/* Tag + heading */}
            <div key={`head-${step}`} className="mb-6 flex-shrink-0">
              <span className="font-jakarta text-[10px] uppercase tracking-widest text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full fade-in">
                {tags[step - 1]} · {step}/{TOTAL}
              </span>
              <h1
                className="font-playfair text-stone-900 leading-tight mt-3 mb-2 fade-up"
                style={{ fontSize: "clamp(1.4rem,2.2vw,1.85rem)" }}
              >
                {titles[step - 1]}
              </h1>
              <p className="font-jakarta text-sm text-stone-400 leading-relaxed fade-up d1">
                {subs[step - 1]}
              </p>
            </div>

            {step === 1 && (
              <StepOne details={details} setDetails={setDetails} />
            )}
            {step === 2 && (
              <OnboardingForm details={details} setDetails={setDetails} />
            )}
            {step === 3 && <StepThree />}
            {step === 4 && <StepFour details={details} />}

            {/* ── NAV ── */}
            <div className="flex flex-col gap-3 mt-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => i + 1 < step && setStep(i + 1)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 === step
                        ? "bg-amber-500 w-6"
                        : i + 1 < step
                          ? "bg-amber-200 w-3 cursor-pointer"
                          : "bg-stone-100 w-3"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2.5">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={back}
                    className="font-jakarta text-sm text-stone-400 border border-stone-200 bg-white px-5 py-3 rounded-xl hover:border-stone-300 hover:text-stone-600 transition-all"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={step < TOTAL ? next : handleCreateProperty}
                  className="btn-shine flex-1 font-jakarta text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-100 hover:opacity-95 transition-all"
                >
                  {step === TOTAL ? "Go to Dashboard →" : "Continue"}
                  {step < TOTAL && <Ic.Arrow />}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <RightPanel step={step} TOTAL={TOTAL} details={details} />
        </div>
      </div>
    </div>
  );
}
