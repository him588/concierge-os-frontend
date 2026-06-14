import { AuthMode } from "@/features/auth/components/types/types";
import { AuthInput } from "@/features/auth/components/auth-input";
import { Icons } from "@/features/auth/components/icons/icons";
import { useAuthService } from "@/features/auth/components/hooks/use-auth";
import { handleChangeInput } from "@/components/helper/input";
import { useEffect, useState } from "react";
import { useUIContext } from "@/context/ui-context";
import { returnAxiosError } from "@/components/helper/axios";
import { OtpStep } from "@/features/auth/components/otp-verification";
import { useBaseContext } from "@/context/base-context";
import { handleLoginUser, handleRegisterUser } from "./services/services";
import { setAccessToken } from "@/components/lib/token-store";
import { tokenPayload } from "@/components/helper/jwt";
import { useRouter } from "next/navigation";

export function AuthForm({
  mode,
  animKey,
}: {
  mode: AuthMode;
  animKey: AuthMode;
}) {
  const { validateForm } = useAuthService();
  const { setToastType, setToastMessage } = useUIContext();
  const { setUserDetails: setDetails } = useBaseContext();
  const router = useRouter();

  const [showOtp, setShowOtp] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    agreed: false,
  });

  useEffect(() => {
    function handleReset() {
      setUserDetails({
        name: "",
        email: "",
        password: "",
        confPassword: "",
        agreed: false,
      });
      setShowOtp(false);
    }
    handleReset();
  }, [mode]);

  async function registerUser() {
    const isValid = validateForm(mode, userDetails);
    if (!isValid) return;
    try {
      const response = await handleRegisterUser(userDetails);
      const user = response.data.user;
      setDetails({
        name: user.name || "",
        email: user.email || "",
        propertyId: null,
        role: user.role || "",
        userId: user.userId || "",
        propertyName: null,
      });
      setToastMessage(`OTP  is only valid for 5 minutes  `);
      setToastType("success");

      if (mode === "signup") setShowOtp(true);
    } catch (error) {
      const errorMsg = returnAxiosError(error);
      setToastMessage(errorMsg);
      setToastType("error");
    }
  }

  async function handleLogin() {
    if (!userDetails.email.includes("@")) {
      setToastType("error");
      setToastMessage("Please enter a valid email");
      return;
    }
    if (userDetails.password.length < 6) {
      setToastType("error");
      setToastMessage("Password should be greater that 6 char");
      return;
    }
    try {
      const response = await handleLoginUser(
        userDetails.email,
        userDetails.password,
      );
      setAccessToken(response.data.accessToken);
      const token = tokenPayload(response.data.accessToken);
      if (token?.hotelId) {
        router.push("/overview");
      } else {
        router.push("/onboarding");
      }
    } catch (error) {
      const err = returnAxiosError(error);
      setToastType("error");
      setToastMessage(err);
    }
  }

  // ── OTP screen ──
  if (showOtp) {
    return <OtpStep />;
  }

  // ── Normal form ──
  return (
    <>
      {/* Fields */}
      <div key={`${animKey}-fields`} className="flex flex-col gap-3.5">
        {mode === "signup" && (
          <div className="fade-up d1">
            <AuthInput
              label="Full Name"
              placeholder="Sarah Mitchell"
              value={userDetails.name}
              onChange={(e) => handleChangeInput(setUserDetails, e, "name")}
              icon={<Icons.User />}
            />
          </div>
        )}

        <div className={mode === "signup" ? "fade-up d3" : "fade-up d1"}>
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="gm@yourhotel.com"
            value={userDetails.email}
            onChange={(e) => handleChangeInput(setUserDetails, e, "email")}
            icon={<Icons.Mail />}
          />
        </div>

        <div className={mode === "signup" ? "fade-up d4" : "fade-up d2"}>
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••••"
            value={userDetails.password}
            onChange={(e) => handleChangeInput(setUserDetails, e, "password")}
            icon={<Icons.Lock />}
          />
        </div>

        {mode === "signup" && (
          <div className="fade-up d5">
            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••••"
              value={userDetails.confPassword}
              onChange={(e) =>
                handleChangeInput(setUserDetails, e, "confPassword")
              }
              icon={<Icons.Lock />}
            />
          </div>
        )}
      </div>

      {/* Forgot / Terms */}
      <div className="mt-3 mb-5 fade-up">
        {mode === "login" ? (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() =>
                  setUserDetails((p) => ({ ...p, agreed: !p.agreed }))
                }
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                  userDetails.agreed
                    ? "bg-amber-500 border-amber-500"
                    : "border-stone-300"
                }`}
              >
                {userDetails.agreed && <Icons.Check />}
              </div>
              <span className="font-jakarta text-xs text-stone-400">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="font-jakarta text-xs text-amber-600 hover:text-amber-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        ) : (
          <label className="flex items-start gap-2 cursor-pointer">
            <div
              onClick={() =>
                setUserDetails((p) => ({ ...p, agreed: !p.agreed }))
              }
              className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all cursor-pointer ${
                userDetails.agreed
                  ? "bg-amber-500 border-amber-500"
                  : "border-stone-300"
              }`}
            >
              {userDetails.agreed && <Icons.Check />}
            </div>
            <span className="font-jakarta text-xs text-stone-400 leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-amber-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-amber-600 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={mode === "login" ? handleLogin : registerUser}
        className="btn-shine w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-jakarta text-sm font-medium py-3.5 rounded-xl shadow-md shadow-amber-100 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 fade-up"
      >
        {mode === "login" ? "Sign In to Dashboard" : "Create My Account"}
        <Icons.Arrow />
      </button>
    </>
  );
}

export default AuthForm;
