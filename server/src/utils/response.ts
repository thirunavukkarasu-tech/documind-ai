import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
}

export function sendError(
  res: Response,
  message: string,
  error?: unknown,
  statusCode = 500
): Response<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errorMessage && { error: errorMessage }),
  });
}
