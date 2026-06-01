import api from "@/lib/axios";

export const getAiFeedbacks = () => api.get("/ai-feedbacks");

export const getAiFeedbackDetail = (id: string) =>
  api.get(`/ai-feedbacks/${id}`);
