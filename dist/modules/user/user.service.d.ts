export interface User {
    id: number;
    email: string;
    password?: string;
    role: string;
    [key: string]: any;
}
export declare const userService: {
    findAll: ({ page, limit }?: {
        page?: number;
        limit?: number;
    }) => Promise<{
        data: any[];
        total: number;
    }>;
    findById: (id: number) => Promise<User>;
    create: (data: Partial<User>) => Promise<any>;
    update: (id: number, data: Partial<User>) => Promise<any>;
    remove: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=user.service.d.ts.map