import api from "@/lib/axios";

import type { ApiResource } from "@/types/api";
import type { RoutineCompletion } from "@/types/routine";

export const completeRoutineItem = (
  payload: {
    routine_item_id: string;
    completed_date: string;
    status: string;
    note?: string;
  }
) =>
  api.post<ApiResource<RoutineCompletion>>(
    "/routine-completions",
    payload
  );

export const deleteRoutineCompletion = (
  id: string
) =>
  api.delete(
    `/routine-completions/${id}`
  );
