import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Post, 
  CreatePostRequest,
  UpdateProfileRequest,
  ProfileResponse,
  FollowResponse,
  UserSearchResponse,
  User
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginRequest): Promise<{ data: AuthResponse }> =>
    api.post('/login', data),
  
  register: (data: RegisterRequest): Promise<{ data: AuthResponse }> =>
    api.post('/register', data),
  
  logout: (): Promise<{ data: { message: string } }> =>
    api.post('/logout'),
  
  me: (): Promise<{ data: { user: any } }> =>
    api.get('/me'),
};

export const postsAPI = {
  getPosts: (): Promise<{ data: { data: Post[] } }> =>
    api.get('/posts'),
  
  createPost: (data: CreatePostRequest): Promise<{ data: { post: Post } }> =>
    api.post('/posts', data),
  
  updatePost: (id: number, data: CreatePostRequest): Promise<{ data: { post: Post } }> =>
    api.put(`/posts/${id}`, data),
  
  deletePost: (id: number): Promise<{ data: { message: string } }> =>
    api.delete(`/posts/${id}`),
};

export const profileAPI = {
  getProfile: (username?: string): Promise<{ data: ProfileResponse }> =>
    api.get(username ? `/profile/${username}` : '/profile'),
  
  updateProfile: (data: UpdateProfileRequest): Promise<{ data: { user: User } }> =>
    api.put('/profile', data),
  
  updateProfileWithImages: (formData: FormData): Promise<{ data: { user: User } }> =>
    api.put('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteAvatar: (): Promise<{ data: { user: User } }> =>
    api.delete('/profile/avatar'),
  
  deleteCoverPhoto: (): Promise<{ data: { user: User } }> =>
    api.delete('/profile/cover-photo'),
  
  getUserPosts: (username?: string): Promise<{ data: { data: Post[] } }> =>
    api.get(username ? `/profile/${username}/posts` : '/profile/posts'),
};

export const followAPI = {
  follow: (userId: number): Promise<{ data: FollowResponse }> =>
    api.post(`/follow/${userId}`),
  
  unfollow: (userId: number): Promise<{ data: FollowResponse }> =>
    api.delete(`/follow/${userId}`),
  
  toggleFollow: (userId: number): Promise<{ data: FollowResponse }> =>
    api.post(`/follow/${userId}/toggle`),
  
  getFollowers: (userId: number): Promise<{ data: { data: User[] } }> =>
    api.get(`/follow/${userId}/followers`),
  
  getFollowing: (userId: number): Promise<{ data: { data: User[] } }> =>
    api.get(`/follow/${userId}/following`),
  
  getSuggestions: (): Promise<{ data: User[] }> =>
    api.get('/follow/suggestions'),
  
  searchUsers: (query: string): Promise<{ data: UserSearchResponse }> =>
    api.get(`/users/search?q=${encodeURIComponent(query)}`),
};

export default api;
