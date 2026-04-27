import type { Request, Response } from 'express';

// ค่าเริ่มต้นเมื่อไม่ได้ตั้ง env
const DEFAULT_COOKIE_NAME = 'access_token';
const DEFAULT_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

type SameSite = 'lax' | 'strict' | 'none';

const parseBoolean = (value?: string): boolean => value?.toLowerCase() === 'true';

// บังคับค่า SameSite ให้เหลือเฉพาะค่าที่ cookie รองรับ
const normalizeSameSite = (value?: string): SameSite => {
  const normalized = value?.toLowerCase();
  if (normalized === 'strict' || normalized === 'none') return normalized;
  return 'lax';
};

export const getAuthCookieName = (): string =>
  process.env.AUTH_COOKIE_NAME || DEFAULT_COOKIE_NAME;

// ใช้ config ชุดเดียวกันตอน set และ clear cookie
export const getAuthCookieOptions = () => {
  const sameSite = normalizeSameSite(process.env.AUTH_COOKIE_SAME_SITE);
  const secure = parseBoolean(process.env.AUTH_COOKIE_SECURE) || sameSite === 'none';
  const maxAge = Number(process.env.AUTH_COOKIE_MAX_AGE_MS || DEFAULT_COOKIE_MAX_AGE_MS);

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge,
    path: '/',
  } as const;
};

// เก็บ token ลง httpOnly cookie
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(getAuthCookieName(), token, getAuthCookieOptions());
};

// ลบ auth cookie โดยใช้ key และ option ชุดเดิม
export const clearAuthCookie = (res: Response): void => {
  const { path, secure, sameSite } = getAuthCookieOptions();
  res.clearCookie(getAuthCookieName(), { path, secure, sameSite });
};

const findCookieValue = (cookieHeader: string, cookieName: string): string | null => {
  const cookieEntries = cookieHeader.split(';').map((entry) => entry.trim());
  const matchedCookie = cookieEntries.find((entry) =>
    entry.startsWith(`${cookieName}=`),
  );

  if (!matchedCookie) return null;

  return decodeURIComponent(matchedCookie.slice(cookieName.length + 1));
};

// ดึง token จาก cookie header ของ request
export const getAuthTokenFromRequest = (req: Request): string | null => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length).trim() || null;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  return findCookieValue(cookieHeader, getAuthCookieName());
};
