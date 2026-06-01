import api from "@/lib/axios";

export const getFocusSessions = () => api.get("/focus-sessions");

export const getFocusSessionDetail = (id: string) =>
  api.get(`/focus-sessions/${id}`);
