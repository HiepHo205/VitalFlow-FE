import api from "@/lib/axios";

export const getWeeklyReports = () => api.get("/weekly-reports");

export const getWeeklyReportDetail = (id: string) =>
  api.get(`/weekly-reports/${id}`);
