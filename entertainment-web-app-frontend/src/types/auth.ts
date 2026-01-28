export interface User {
  id: string;
  email: string;
  bookmarks: string[];
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}
