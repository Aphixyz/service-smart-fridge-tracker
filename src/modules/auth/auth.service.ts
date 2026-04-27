import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { appError } from "../../common/error/AppError.ts";
import { throwIf } from "../../common/utils/checker.ts";
import { authRepository } from "./auth.repository.ts";
import type {
  AuthenticatedUser,
  AuthTokenPayload,
  LoginResult,
  LoginInput,
} from "./auth.type.ts";

export const authService = {
  async login(data: LoginInput): Promise<LoginResult> {
    // เช็คข้อมูลเบื้องต้น
    this.validateLoginInput(data);

    const payload = {
      username: data.username.trim(),
      password: data.password,
    };
    // ค้นหาผู้ใช้
    const user = await authRepository.findOneByUsername(payload.username);

    // ใช้ if ปกติเพื่อหยุดการทำงานและทำ Type Guard
    if (!user) {
      throw appError.unauthorized("Invalid username or password");
    }

    // ตรงนี้ TypeScript จะฉลาดพอที่จะรู้ว่า user ไม่เป็น null แน่นอน (ไม่ต้องเช็คซ้ำแล้ว)
    const isMatch = await this.comparePassword(payload.password, user.password);

    if (!isMatch) {
      throw appError.unauthorized("Invalid username or password");
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      username: user.username,
    };
    return {
      token: this.signAccessToken(this.buildUserPayload(authenticatedUser)),
      user: authenticatedUser,
    };
  },

  validateLoginInput(data: LoginInput): void {
    throwIf(appError.badRequest("username is required"))(
      !data.username?.trim(),
    );
    throwIf(appError.badRequest("password is required"))(
      !data.password?.trim(),
    );
  },

  buildUserPayload(user: AuthenticatedUser): AuthTokenPayload {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  },

  signAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn:
        (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "1d",
    });
  },

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },
};
