import { useState, useCallback } from 'react';
import { useAuth as useAuthContext } from '../contexts/auth.context';
import { authAPI } from '../services/api';

export const useLogin = () => {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authAPI.login({ email, password });
        login(response.user, response.accessToken);
        return response;
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Login failed. Please check your credentials.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return { loginUser, isLoading, error };
};

export const useRegister = () => {
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useCallback(
    async (firstName: string, lastName: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authAPI.register({ firstName, lastName, email, password });
        login(response.user, response.accessToken);
        return response;
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Registration failed. Please try again.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  return { registerUser, isLoading, error };
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.logout();
      logout();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Logout failed.';
      setError(message);
      // Still logout locally even if server logout fails
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return { logoutUser, isLoading, error };
};

export const useCurrentUser = () => {
  const { user, isLoading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setError(null);

    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch user.';
      setError(message);
      throw err;
    }
  }, []);

  return { user, isLoading, error, fetchCurrentUser };
};
