import { useState, useRef, ChangeEvent } from "react";
import { Icons } from "@/features/auth/components/icons/icons";
import { useUIContext } from "@/context/ui-context";
import { returnAxiosError } from "@/components/helper/axios";
import { useBaseContext } from "@/context/base-context";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setAccessToken } from "@/components/lib/token-store";
import { handleVerifyUser } from "./services/services";

export function OtpStep() {
  const [digits, setDigits] = useState<string[]>(Array(4).fill(""));
  const router = useRouter();
  const { userDetails } = useBaseContext();

  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  const refs = [ref0, ref1, ref2, ref3];

  const { setToastMessage, setToastType } = useUIContext();

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const next = [...digits];
    next[i] = val.slice(-1);

    setDigits(next);

    // Move to next input
    if (val && i < 3) {
      refs[i + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Move back on backspace
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pasted) return;

    const next = Array(4).fill("");

    pasted.split("").forEach((char, index) => {
      if (index < 4) {
        next[index] = char;
      }
    });

    setDigits(next);

    // Focus last filled box
    refs[Math.min(pasted.length - 1, 3)].current?.focus();

    e.preventDefault();
  };

  const filled = digits.every((d) => d !== "");

  async function verifyOtp(otp: string) {
    try {
      if (!userDetails) return;

      const response = await handleVerifyUser(userDetails.userId, otp);

      setToastMessage("User verified successfully");
      setToastType("success");

      setAccessToken(response.data.accessToken);

      Cookies.set("refreshToken", response.data.refreshToken, {
        expires: 7,
      });

      router.push("/onboarding");
    } catch (error) {
      const errorMsg = returnAxiosError(error);

      setToastMessage(errorMsg);
      setToastType("error");
    }
  }

  return (
    <div className="flex flex-col gap-5 fade-up">
      {/* Header */}
      <div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-100 mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>

        <h1 className="font-playfair text-stone-900 text-2xl mb-1">
          Check your inbox
        </h1>

        <p className="font-jakarta text-sm text-stone-400 leading-relaxed">
          We sent a 4-digit code to{" "}
          <span className="text-stone-600 font-medium">
            {userDetails?.email}
          </span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex gap-2.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(i, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-[3rem] aspect-square text-center font-playfair text-xl text-stone-800
              border-2 rounded-xl bg-amber-50/50 transition-all outline-none
              focus:border-amber-400 focus:bg-amber-50
              focus:shadow-[0_0_0_3px_rgba(217,119,6,.1)]
              ${digit ? "border-amber-300 bg-amber-50" : "border-stone-200"}`}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="button"
        disabled={!filled}
        onClick={() => verifyOtp(digits.join(""))}
        className={`w-full font-jakarta text-sm font-medium py-3.5 rounded-xl
          flex items-center justify-center gap-2 transition-all
          ${
            filled
              ? "btn-shine bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-100 hover:opacity-95"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          }`}
      >
        Verify & Continue
        <Icons.Arrow />
      </button>
    </div>
  );
}
