import { postRepository } from './post.repository.ts';
import { userService } from '../user/user.service.ts';

export const postService = {
  createPost: async (userId, content) => {
    await userService.findById(userId);
    return await postRepository.create({
      userId,
      content,
      status: 'published'
    });
  },

  getUserPosts: async (userId) => {
    await userService.findById(userId);
    return await postRepository.findByUserId(userId);
  }
};
