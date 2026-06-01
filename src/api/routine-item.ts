import api from "@/lib/axios";

import type { ApiResource } from "@/types/api";
import type { RoutineItem, RoutineItemFormData } from "@/types/routine";

export const createRoutineItem = (
  routineId: string,
  payload: RoutineItemFormData
) => {
  return api.post<ApiResource<RoutineItem>>(
    `/routines/${routineId}/items`,
    payload
  );
};

export const updateRoutineItem = (
  routineId: string,
  itemId: string,
  payload: RoutineItemFormData
) => {
  return api.put<ApiResource<RoutineItem>>(
    `/routines/${routineId}/items/${itemId}`,
    payload
  );
};

export const deleteRoutineItem = (
  routineId: string,
  itemId: string
) => {
  return api.delete(
    `/routines/${routineId}/items/${itemId}`
  );
};
