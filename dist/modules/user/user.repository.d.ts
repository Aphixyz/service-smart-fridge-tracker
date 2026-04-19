export declare const userRepository: {
    findMany: ({ start, limit }: {
        start: number;
        limit: number;
    }) => Promise<{
        data: any[];
        total: number;
    }>;
    findOneById: (id: number) => Promise<any>;
    findOneByEmail: (email: string) => Promise<any>;
    create: (userData: any) => Promise<any>;
    update: (id: number, updateData: any) => Promise<any>;
    delete: (id: number) => Promise<boolean>;
};
//# sourceMappingURL=user.repository.d.ts.map