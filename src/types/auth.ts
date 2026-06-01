export interface HealthProfile {
  id: string;
  user_id: string;
  age: number;
  gender: string | null;
  height_cm: number;
  weight_kg: number;
  work_type: string | null;
  baseline_sleep_hours: number | null;
  baseline_stress_level: number | null;
  updated_at: string;
}

export interface UserSetting {
  theme: string;
  timezone: string;
  notification_enabled: boolean;
  ai_auto_analysis: boolean;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  health_profile: HealthProfile | null;
  settings: UserSetting | null;
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: User;
}

