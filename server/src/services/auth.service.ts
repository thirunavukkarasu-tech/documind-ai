import { User, UserRole } from '../models/user.model';
import { hashPassword, comparePassword, isPasswordStrong } from '../utils/password';
import { generateTokenPair, TokenPair } from '../utils/jwt';
import {
  RegisterRequest,
  LoginRequest,
  UserResponse,
  toUserResponse,
} from '../types/auth.types';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{ user: UserResponse; tokens: TokenPair }> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Validate password strength
    const passwordValidation = isPasswordStrong(data.password);
    if (!passwordValidation.isStrong) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user (always as USER role, never ADMIN)
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.USER,
      isActive: true,
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: toUserResponse(user),
      tokens,
    };
  }

  /**
   * Login a user
   */
  async login(
    data: LoginRequest
  ): Promise<{ user: UserResponse; tokens: TokenPair }> {
    // Find user and explicitly select password
    const user = await User.findOne({
      email: data.email.toLowerCase(),
    }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is not active');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: toUserResponse(user),
      tokens,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return toUserResponse(user);
  }
}

export const authService = new AuthService();
