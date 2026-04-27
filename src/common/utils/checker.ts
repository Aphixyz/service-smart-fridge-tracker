
import type { AppError } from "../error/AppError.ts";

export const ensure = {
  not: (condition: boolean, error: AppError): void => {
    if (condition) throw error;
  },

  exists: <T>(data: T | null | undefined, error: AppError): T => {
    if (!data) throw error;
    return data;
  },
};

export const throwIf = (error: AppError) => <T>(data: T): T => {
  if (data) throw error;
  return data;
};

export const catchNotFound = (error: AppError) => <T>(
  data: T | null | undefined,
): T => {
  if (!data) throw error;
  return data;
};
