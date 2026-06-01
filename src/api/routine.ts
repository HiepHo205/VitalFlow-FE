import api from "@/lib/axios";

import type { ApiResource, PaginatedApiResource } from "@/types/api";
import type {
  CreateRoutinePayload,
  GenerateRoutinePayload,
  GenerateRoutineResponse,
  Routine,
  UpdateRoutinePayload,
} from "@/types/routine";

export const getRoutines = (goalId?: string) => {
  return api.get<PaginatedApiResource<Routine>>("/routines", {
    params: goalId
      ? {
          goal_id: goalId,
        }
      : {},
  });
};

export const getRoutineDetail = (id: string) => {
  return api.get<ApiResource<Routine>>(`/routines/${id}`);
};

export const createRoutine = (payload: CreateRoutinePayload) => {
  return api.post<ApiResource<Routine>>("/routines", payload);
};

export const updateRoutine = (id: string, payload: UpdateRoutinePayload) => {
  return api.put<ApiResource<Routine>>(`/routines/${id}`, payload);
};

export const deleteRoutine = (id: string) => {
  return api.delete(`/routines/${id}`);
};

export const generateRoutine = (payload: GenerateRoutinePayload) => {
  return api.post<GenerateRoutineResponse>("/routines/generate", payload);
};

export const analyzeRoutine = (id: string) => {
  return api.post(`/routines/${id}/analyze`);
};
