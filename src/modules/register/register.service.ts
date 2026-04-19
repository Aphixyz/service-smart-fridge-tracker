import bcrypt from "bcryptjs";
import { registerRepository } from "./register.repository.ts";
import { appError } from "../../common/error/AppError.ts";
import { throwIf, catchNotFound } from "../../common/utils/checker.ts";

export interface UserRegister {
  id: number;
  name: string;
  username: string;
  password: string;
}

export const registerService = {
  save: async (data: Partial<UserRegister>) => {
    // เช็ค validate
    throwIf(appError.badRequest("name is required"))(!data.name);
    throwIf(appError.badRequest("username is required"))(!data.username);
    throwIf(appError.badRequest("password is required"))(!data.password);
    // เช็ค username ซ้ำ
    const existUser = await registerRepository.findExistUsername(
      data.username!,
    );
    throwIf(appError.badRequest("username already exists"))(!!existUser);
    // เข้ารหัสพาสเวิร์ด
    const hashPassword = await registerService.hashPassword(data.password!);
    const newUser = await registerRepository.createUser({
      name: data.name!,
      username: data.username!,
      password: hashPassword,
    });
    catchNotFound(newUser);
    return newUser;
  },

  hashPassword: async (password: any) => {
    return bcrypt.hash(password, 12);
  },
};
