import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { appError } from '../../common/error/AppError.ts';
import { authRepository } from './auth.repository.ts';
import type { AuthenticatedUser, AuthTokenPayload, LoginResult } from './auth.type.ts';

const buildUserPayload = (user: AuthenticatedUser): AuthTokenPayload => ({
  id: user.id,
  username: user.username,
});

const signAccessToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d',
  });

export const authService = {
  login: async (username: string, password: string): Promise<LoginResult> => {
    const user = await authRepository.findOneByUsername(username);
    if (!user) throw appError.unauthorized('Invalid username or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw appError.unauthorized('Invalid username or password');

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    return {
      token: signAccessToken(buildUserPayload(authenticatedUser)),
      user: authenticatedUser,
    };
  }
};
