export interface RoutineCompletion {
  id: string;
  routine_item_id: string;
  completed_date: string;
  status: string;
  note: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoutineItem {
  id: string;
  routine_id: string;
  title: string;
  description: string | null;
  category: string | null;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  priority: number;
  recurrence_type: string;
  created_at: string;
  updated_at: string;
  completions?: RoutineCompletion[];
}

export interface Routine {
  id: string;
  goal_id: string;
  name: string;
  description: string | null;
  is_ai_generated: boolean;
  items: RoutineItem[];
  created_at: string;
  updated_at: string;
}

export interface RoutineItemFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  priority: number;
  recurrence_type: string;
}

export interface RoutineFormData {
  name: string;
  description: string;
  is_ai_generated: boolean;
  items: RoutineItemFormData[];
}

export interface CreateRoutinePayload extends RoutineFormData {
  goal_id: string;
  replace_routine_ids?: string[];
}

export type UpdateRoutinePayload = Partial<
  Pick<Routine, "name" | "description" | "is_ai_generated">
> & {
  items?: RoutineItemFormData[];
};

export interface GenerateRoutinePayload {
  goal_id: string;
}

export interface AiRoutineDraft extends RoutineFormData {
  goal_id?: string;
}

export interface RoutineConflict {
  routine_id: string;
  routine_name: string;
  overlapping_items: {
    existing_item_id: string;
    existing_item_title: string;
    draft_item_index: number;
    draft_item_title: string | null;
  }[];
}

export interface GenerateRoutineResponse {
  draft: AiRoutineDraft;
  conflicts: RoutineConflict[];
}

