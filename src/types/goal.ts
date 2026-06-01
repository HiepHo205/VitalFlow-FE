export interface Goal {
  id: string;
  goal_type: string;
  target_value: string | number | null;
  current_value: string | number | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GoalPayload {
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  status: string;
}

export type UpdateGoalPayload = Partial<GoalPayload>;
