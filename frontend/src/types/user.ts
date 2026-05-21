export interface UserProfile {
  id: number;
  email: string;
  display_name?: string;
  email_verified: boolean;
  mfa_enabled: boolean;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
