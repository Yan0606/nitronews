export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  bio?: string;
  avatar?: string;
  cover_photo?: string;
  birth_date?: string;
  location?: string;
  website?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  gravatar: string;
  avatar_url?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreatePostRequest {
  content: string;
  is_public: boolean;
}

export interface UpdateProfileRequest {
  name: string;
  username: string;
  bio?: string;
  location?: string;
  website?: string;
  birth_date?: string;
}

export interface ProfileResponse {
  user: User;
  is_following: boolean;
  is_own_profile: boolean;
}

export interface FollowResponse {
  message: string;
  is_following: boolean;
}

export interface UserSearchResponse {
  users: User[];
}
