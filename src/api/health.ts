import api from "@/lib/axios";

export const getHealthProfile = () =>
  api.get("/health-profile");

export const updateHealthProfile = (payload: {
  age: number;
  weight: number;
  height: number;
}) => api.put("/health-profile", payload);