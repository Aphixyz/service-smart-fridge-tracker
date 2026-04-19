export const apiResponse = {
    ok: (data, message = 'Success') => ({
        success: true,
        message,
        data
    }),
    created: (data, message = 'Created successfully') => ({
        success: true,
        message,
        data
    }),
    paginated: (data, page, limit, total) => ({
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
    error: (message = 'Something went wrong', errors = null) => ({
        success: false,
        message,
        ...(errors && { errors })
    })
};
//# sourceMappingURL=ApiResponse.js.map