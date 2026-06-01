export interface DailyLog {
  id: string;
  log_date: string;
  mood_score: number | null;
  energy_level: number | null;
  stress_level: number | null;
  sleep_hours: number | null;
  water_intake_ml: number | null;
  body_condition: string | null;
  productivity_score: number | null;
  created_at: string;
  updated_at: string;
}
