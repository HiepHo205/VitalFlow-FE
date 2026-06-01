import api from "@/lib/axios";

import type { ApiResource, PaginatedApiResource } from "@/types/api";
import type { Goal, GoalPayload } from "@/types/goal";

export const getGoals = () => {
  return api.get<PaginatedApiResource<Goal>>("/goals");
};

export const getGoalDetail = (id: string) => {
  return api.get<ApiResource<Goal>>(`/goals/${id}`);
};

export const createGoal = (payload: GoalPayload) => {
  return api.post<ApiResource<Goal>>("/goals", payload);
};

export const updateGoal = (id: string, payload: UpdateGoalPayload) => {
  return api.put<ApiResource<Goal>>(`/goals/${id}`, payload);
};

export const deleteGoal = (id: string) => {
  return api.delete(`/goals/${id}`);
};
