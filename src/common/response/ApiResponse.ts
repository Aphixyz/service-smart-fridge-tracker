
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: any;
}

export const apiResponse = {
  ok: <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
    success: true,
    message,
    data
  }),

  created: <T>(data: T, message: string = 'Created successfully'): ApiResponse<T> => ({
    success: true,
    message,
    data
  }),

  paginated: <T>(data: T[], page: number, limit: number, total: number): ApiResponse<T[]> => ({
    success: true,
    message: 'Success',
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }),

  error: (message: string = 'Something went wrong', errors: any = null): ApiResponse => ({
    success: false,
    message,
    ...(errors && { errors })
  })
};
