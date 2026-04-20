import bcrypt from "bcryptjs";
import { registerRepository } from "./register.repository.ts";
import { appError } from "../../common/error/AppError.ts";
import { throwIf } from "../../common/utils/checker.ts";
import { CreateUserRegisterInput } from "./register.type.ts";

export const registerService = {
  
  async save(data: CreateUserRegisterInput) {
    // เช็คข้อมูลเบื้องต้น
    this.validateRegisterInput(data);

    const payload = {
      name: data.name.trim(),
      username: data.username.trim(),
      password: data.password,
    };

    // เช็ค username ซ้ำ
    const existUser = await registerRepository.findExistUsername(payload.username);
    throwIf(appError.badRequest("username already exists"))(!!existUser);

    // เข้ารหัสพาสเวิร์ด
    const hashedPassword = await this.hashPassword(payload.password);

    // สร้าง user
    const newUser = await registerRepository.createUser({
      name: payload.name,
      username: payload.username,
      password: hashedPassword,
    });

    throwIf(appError.internal("failed to create user"))(!newUser);

    return newUser;
  },

  validateRegisterInput(data: CreateUserRegisterInput): void {
    throwIf(appError.badRequest("name is required"))(!data.name?.trim());
    throwIf(appError.badRequest("username is required"))(!data.username?.trim());
    throwIf(appError.badRequest("password is required"))(!data.password?.trim());
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  },
};
