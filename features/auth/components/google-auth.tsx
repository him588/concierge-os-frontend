"use client";
import React from "react";
import { Icons } from "./icons/icons";
import {
  GoogleOAuthProvider,
  TokenResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import { handleGoogleAuth } from "./services/services";
import { setAccessToken } from "@/components/lib/token-store";
import { useRouter } from "next/navigation";
import { useBaseContext } from "@/context/base-context";

function GoogleAuth() {
  const router = useRouter();
  const { setIsAuthReady } = useBaseContext();
  async function googleResponse(
    res: Omit<TokenResponse, "error" | "error_description" | "error_uri">,
  ) {
    try {
      console.log(res);
      if (res.access_token) {
        const response = await handleGoogleAuth(res.access_token);
        if (response.status === 201 || response.status === 200) {
          setAccessToken(response.data.accessToken);
          if (response.data.user.hotelId) {
            router.push("/overview");
          } else {
            router.push("/onboarding");
          }
        }
        setAccessToken(response.data.accessToken || "");
        setIsAuthReady(true);
      }
    } catch (error) {
      console.log("Error while google authentication", error);
    }
  }
  async function googleError(errorResponse: any) {
    console.log("Google Login Error:", errorResponse);

    if (errorResponse?.error === "popup_closed_by_user") {
      console.log("User closed the popup");
    } else {
      console.log("Something went wrong with Google auth");
    }
  }
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleError,
  });
  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      className="google-btn w-full flex items-center justify-center gap-3 bg-white border border-stone-200 rounded-xl py-3 mb-5 fade-up d1"
    >
      <Icons.Google />
      <span className="font-jakarta text-sm font-medium text-stone-600">
        Continue with Google
      </span>
    </button>
  );
}

export default GoogleAuth;
