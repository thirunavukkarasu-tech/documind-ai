import { IUser } from '../models/user.model';

/**
 * User registration request
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * User login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User response (safe to send to client)
 */
export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

/**
 * Token refresh response
 */
export interface RefreshResponse {
  accessToken: string;
}

/**
 * Convert IUser to UserResponse
 */
export function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}
