// Type definitions for the application
// These will be expanded in future phases

export interface ApiError extends Error {
  statusCode?: number;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  sort?: string;
}
