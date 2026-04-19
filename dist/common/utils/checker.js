export const ensure = {
    not: (condition, error) => {
        if (condition)
            throw error;
    },
    exists: (data, error) => {
        if (!data)
            throw error;
        return data;
    }
};
export const throwIf = (error) => (data) => {
    if (data)
        throw error;
    return data;
};
export const catchNotFound = (error) => (data) => {
    if (!data)
        throw error;
    return data;
};
//# sourceMappingURL=checker.js.map