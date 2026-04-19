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
export declare const apiResponse: {
    ok: <T>(data: T, message?: string) => ApiResponse<T>;
    created: <T>(data: T, message?: string) => ApiResponse<T>;
    paginated: <T>(data: T[], page: number, limit: number, total: number) => ApiResponse<T[]>;
    error: (message?: string, errors?: any) => ApiResponse;
};
//# sourceMappingURL=ApiResponse.d.ts.map