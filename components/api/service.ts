import axios from "axios";
import { ENV } from "../config/env";
import apiClient from "./service-provider";

export function refreshAccessToken() {
  console.log(process.env.ServiceBaseUrl);
  return axios.post(
    `${ENV.API_BASE_URL}/auth/refresh-accesstoken`,
    {},
    { withCredentials: true },
  );
}

export function getUserDetails() {
  return apiClient.get("/auth/userDetails");
}
