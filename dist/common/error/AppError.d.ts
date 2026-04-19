/**
 * Custom application error factory
 */
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}
export declare const appError: {
    badRequest: (message?: string) => AppError;
    unauthorized: (message?: string) => AppError;
    forbidden: (message?: string) => AppError;
    notFound: (message?: string) => AppError;
    conflict: (message?: string) => AppError;
    internal: (message?: string) => AppError;
};
//# sourceMappingURL=AppError.d.ts.map