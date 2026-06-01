import api from "@/lib/axios";

export const getLogsAnalysis = (params?: {
  start_date?: string;
  end_date?: string;
}) => api.get("/v1/ai/analyze-logs", { params });
