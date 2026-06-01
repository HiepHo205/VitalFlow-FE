import api from "@/lib/axios";

export const getHealthProfile = () => api.get("/health-profile");

export const updateHealthProfile = (payload: {
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  work_type?: string;
  baseline_sleep_hours?: number;
  baseline_stress_level?: number;
}) => api.put("/health-profile", payload);
