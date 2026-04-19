import bcrypt from 'bcryptjs';
import { userRepository } from './user.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { throwIf, catchNotFound } from '../../common/utils/checker.ts';

export interface User {
  id: number;
  email: string;
  password?: string;
  role: string;
  [key: string]: any;
}

export const userService = {
  findAll: async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const start = (page - 1) * limit;
    return await userRepository.findMany({ start, limit });
  },

  findById: async (id: number): Promise<User> => {
    return await userRepository.findOneById(id)
      .then(catchNotFound(appError.notFound(`User #${id} not found`)));
  },

  create: async (data: Partial<User>) => {
    await userRepository.findOneByEmail(data.email!)
      .then(throwIf(appError.conflict('Email already exists')));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password!, salt);

    return await userRepository.create({
      ...data as any,
      password: hashedPassword,
      role: data.role || 'user'
    });
  },

  update: async (id: number, data: Partial<User>) => {
    await userService.findById(id);

    if (data.email) {
      await userRepository.findOneByEmail(data.email)
        .then(user => {
          if (user && user.id !== id) throw appError.conflict('Email already exists');
        });
    }

    return await userRepository.update(id, data);
  },

  remove: async (id: number) => {
    await userService.findById(id);
    return await userRepository.delete(id);
  }
};
