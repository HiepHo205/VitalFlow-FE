import api from "@/lib/axios";

export const login = (payload: {
  email: string;
  password: string;
}) => api.post("/auth/login", payload);

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;

  health_profile: {
    age: number;
    gender: string;
    height_cm: number;
    weight_kg: number;
    work_type: string;
    baseline_sleep_hours: number;
    baseline_stress_level: number;
  };
}

export const register = async (
  payload: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const me = () => api.get("/auth/me");

export const logout = () => api.post("/auth/logout");

export const refresh = () => api.post("/auth/refresh");


