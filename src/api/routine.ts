import api from "@/lib/axios";

export const getRoutines = () => api.get("/routines");

export const createRoutine = (payload: {
  name: string;
  description: string;
}) => api.post("/routines", payload);

export const getRoutineDetail = (
  id: string
) => {
  return api.get(`/routines/${id}`);
};

export const updateRoutine = (
  id: string,
  payload: {
    name: string;
    description: string;
  }
) =>
  api.put(
    `/routines/${id}`,
    payload
  );

export const deleteRoutine = (
  id: string
) =>
  api.delete(
    `/routines/${id}`
  );

export const generateRoutine = (payload: {
  age: number;
  weight: number;
  height: number;
}) => api.post("/routines/generate", payload);

export const analyzeRoutine = (id: string) =>
  api.post(`/routines/${id}/analyze`);