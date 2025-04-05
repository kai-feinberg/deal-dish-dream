
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  has_completed_onboarding: boolean;
  created_at: string;
  updated_at: string;
}

export type UserPreferences = {
  id: string;
  user_id: string;
  dietary_restrictions: string[];
  allergies: string[];
  preferences: string[];
  created_at: string;
  updated_at: string;
}
