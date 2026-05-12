import api from "@/lib/axios";

export const createRoutineItem = (
  routineId: string,
  payload: any
) => {
  return api.post(
    `/routines/${routineId}/items`,
    payload
  );
};

export const updateRoutineItem = (
  routineId: string,
  itemId: string,
  payload: any
) => {
  return api.put(
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