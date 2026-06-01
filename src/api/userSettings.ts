import api from "@/lib/axios";

export const getUserSettings = () => api.get("/user-settings");

export const updateUserSettings = (payload: {
  timezone?: string;
  notification_enabled?: boolean;
}) => api.patch("/user-settings", payload);
