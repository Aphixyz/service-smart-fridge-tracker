import { Router } from 'express';
import { postService } from './post.service.ts';
import { apiResponse } from '../../common/response/ApiResponse.ts';
export const postRouter = Router();
// Create a post for a user
postRouter.post('/users/:userId/posts', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;
        const post = await postService.createPost(Number(userId), content);
        res.status(201).json(apiResponse.created(post));
    }
    catch (error) {
        next(error);
    }
});
// Get all posts of a user
postRouter.get('/users/:userId/posts', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getUserPosts(Number(userId));
        res.json(apiResponse.ok(posts));
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=post.route.js.map