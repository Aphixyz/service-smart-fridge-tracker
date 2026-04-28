import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { appError } from "../../common/error/AppError.ts";
import { throwIf } from "../../common/utils/checker.ts";
import { authRepository } from "./auth.repository.ts";
import { registerService } from "../register/register.service.ts";
import type {
  AuthenticatedUser,
  AuthTokenPayload,
  LoginResult,
  LoginInput,
  ResetPasswordRequest,
  ResetPasswordResponse
} from "./auth.type.ts";

export const authService = {
  async login(data: LoginInput): Promise<LoginResult> {
    this.validateLoginInput(data);

    const payload = {
      username: data.username.trim(),
      password: data.password,
    };
    // ค้นหาผู้ใช้
    const user = await authRepository.findOneByUsername(payload.username);

    if (!user) {
      throw appError.unauthorized("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    const isMatch = await this.comparePassword(payload.password, user.password);

    if (!isMatch) {
      throw appError.unauthorized("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
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
    throwIf(appError.badRequest("ต้องระบุชื่อผู้ใช้"))(
      !data.username?.trim(),
    );
    throwIf(appError.badRequest("จำเป็นต้องใส่รหัสผ่าน"))(
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


  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const user = await authRepository.findOneByUsername(data.username);
    if (!user) {
      throw appError.unauthorized("ไม่พบผู้ใช้");
    }
    const newPassword = await registerService.hashPassword(data.confirmPassword);
    await authRepository.updatePassword(user.id, newPassword);
    return { message: "รีเซ็ตรหัสผ่านสำเร็จ" };
  }
};
