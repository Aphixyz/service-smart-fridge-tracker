import bcrypt from 'bcryptjs';
import { userRepository } from './user.repository.ts';
import { appError } from '../../common/error/AppError.ts';
import { throwIf, catchNotFound } from '../../common/utils/checker.ts';
export const userService = {
    findAll: async ({ page = 1, limit = 10 } = {}) => {
        const start = (page - 1) * limit;
        return await userRepository.findMany({ start, limit });
    },
    findById: async (id) => {
        return await userRepository.findOneById(id)
            .then(catchNotFound(appError.notFound(`User #${id} not found`)));
    },
    create: async (data) => {
        await userRepository.findOneByEmail(data.email)
            .then(throwIf(appError.conflict('Email already exists')));
        // ━━━ Hash Password ━━━
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        return await userRepository.create({
            ...data,
            password: hashedPassword,
            role: data.role || 'user'
        });
    },
    update: async (id, data) => {
        await userService.findById(id);
        if (data.email) {
            await userRepository.findOneByEmail(data.email)
                .then(user => {
                if (user && user.id !== id)
                    throw appError.conflict('Email already exists');
            });
        }
        return await userRepository.update(id, data);
    },
    remove: async (id) => {
        await userService.findById(id);
        return await userRepository.delete(id);
    }
};
//# sourceMappingURL=user.service.js.map