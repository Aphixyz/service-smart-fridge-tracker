import jwt from 'jsonwebtoken';
import bcryptjst from 'bcryptjstjs';
import { userRepository } from '../user/user.repository.ts';
import { appError } from '../../common/error/AppError.ts';
export const authService = {
    login: async (email, password) => {
        // 1. หา user
        const user = await userRepository.findOneByEmail(email);
        if (!user)
            throw appError.unauthorized('Invalid email or password');
        // 2. เช็ค password
        const isMatch = await bcryptjst.compare(password, user.password);
        if (!isMatch)
            throw appError.unauthorized('Invalid email or password');
        // 3. ออก Token
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        return {
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        };
    }
};
//# sourceMappingURL=auth.service.js.map