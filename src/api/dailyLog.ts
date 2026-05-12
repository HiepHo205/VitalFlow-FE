import api from "@/lib/axios";

export const getDailyLogs = () => {
  return api.get("/daily-logs");
};

export const getDailyLogDetail = (
  id: string
) => {
  return api.get(
    `/daily-logs/${id}`
  );
};

export const createDailyLog = (
  payload: {
    log_date: string;
    mood_score: number;
    energy_level: number;
    stress_level: number;
    sleep_hours: number;
    water_intake_ml: number;
    body_condition: string;
    productivity_score: number;
  }
) => {
  return api.post(
    "/daily-logs",
    payload
  );
};

export const updateDailyLog = (
  id: string,
  payload: {
    log_date: string;
    mood_score: number;
    energy_level: number;
    stress_level: number;
    sleep_hours: number;
    water_intake_ml: number;
    body_condition: string;
    productivity_score: number;
  }
) => {
  return api.put(
    `/daily-logs/${id}`,
    payload
  );
};

export const deleteDailyLog = (
  id: string
) => {
  return api.delete(
    `/daily-logs/${id}`
  );
};