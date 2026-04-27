import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export interface AuthTokenPayload extends JwtPayload {
    id: number;
    username: string;
}

export interface AuthRequest extends Request {
    user?: AuthTokenPayload;
}

export interface AuthUserRecord {
    id: number;
    name: string;
    username: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    username: string;
}

export interface LoginResult {
    token: string;
    user: AuthenticatedUser;
}


export interface LoginInput {
  username: string;
  password: string;
}