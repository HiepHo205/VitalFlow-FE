import api from "@/lib/axios";

export const getNotifications = () => api.get("/notifications");

export const markNotificationRead = (id: string) =>
  api.patch(`/notifications/${id}/read`);
