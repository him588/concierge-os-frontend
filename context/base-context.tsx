"use client";
import { BaseContextType, UserDetails } from "@/components/types/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUIContext } from "./ui-context";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/components/api/service";
import { setAccessToken } from "@/components/lib/token-store";
import { AxiosError } from "axios";
import { useUserDetails } from "@/features/overview/hooks/hooks";

export const BaseContext = createContext<BaseContextType | null>(null);

export default function BaseContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setToastType, setToastMessage } = useUIContext();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  const { data } = useUserDetails(isAuthReady);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(
    data?.data.user,
  );

  useEffect(() => {
    async function refreshToken() {
      try {
        const response = await refreshAccessToken();
        setAccessToken(response.data.accessToken);
        setIsAuthReady(true);
      } catch (error) {
        const err = error as AxiosError;
        if (err.status === 400) return;
        if (err.status === 401) {
          setToastMessage("Session expired. Please login again");
          setToastType("error");
          router.push("/login");
        } else {
          setToastMessage("Something went wrong");
          setToastType("error");
        }
      }
    }
    refreshToken();
  }, [router, setToastMessage, setToastType]);

  useEffect(() => {
    function updateUserDetails() {
      if (data?.data.user) {
        setUserDetails(data?.data.user);
      }
    }
    updateUserDetails();
  }, [data?.data]);

  const baseContextValue = useMemo<BaseContextType | null>(() => {
    return {
      userDetails,
      setUserDetails,
      isAuthReady,
      setIsAuthReady,
    };
  }, [userDetails, isAuthReady]);

  return (
    <BaseContext.Provider value={baseContextValue}>
      {children}
    </BaseContext.Provider>
  );
}

export function useBaseContext() {
  const context = useContext(BaseContext);
  if (context === null) {
    throw new Error("useBaseContext must be used within a BaseContextProvider");
  }
  return context;
}
