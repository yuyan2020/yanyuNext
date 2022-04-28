import { axiosInstance } from "./apiService";
import { useEffect } from "react";

// let token;
// if (typeof window !== "undefined") {
//   token = `Bearer ${localStorage.accessToken}`;
// }

export function login(data) {
  return axiosInstance.post("/login", data);
}
