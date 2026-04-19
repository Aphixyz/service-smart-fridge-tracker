const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
export const appError = {
    badRequest: (message = 'Bad Request') => createError(message, 400),
    unauthorized: (message = 'Unauthorized') => createError(message, 401),
    forbidden: (message = 'Forbidden') => createError(message, 403),
    notFound: (message = 'Not Found') => createError(message, 404),
    conflict: (message = 'Conflict') => createError(message, 409),
    internal: (message = 'Internal Server Error') => createError(message, 500)
};
//# sourceMappingURL=AppError.js.map