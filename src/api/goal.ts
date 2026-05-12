import api from "@/lib/axios";

export const getGoals = () => {
  return api.get("/goals");
};

export const getGoalDetail = (
  id: string
) => {
  return api.get(`/goals/${id}`);
};

export const createGoal = (
  payload: {
    goal_type: string;
    target_value: number;
    current_value: number;
    start_date: string;
    end_date: string;
    status: string;
  }
) => {
  return api.post("/goals", payload);
};

export const updateGoal = (
  id: string,
  payload: {
    goal_type: string;
    target_value: number;
    current_value: number;
    start_date: string;
    end_date: string;
    status: string;
  }
) => {
  return api.put(
    `/goals/${id}`,
    payload
  );
};

export const deleteGoal = (
  id: string
) => {
  return api.delete(`/goals/${id}`);
};