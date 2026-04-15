import express from 'express';
import { allComment, createComment, deleteComment, updateComment } from '../controllers/commentController.js';
import { protectRoute } from '../middleware/auth.js';

const commentRoute = express.Router();

commentRoute.post('/:blogId', protectRoute, createComment);
commentRoute.delete('/:id', protectRoute, deleteComment);
commentRoute.put('/:id', protectRoute, updateComment);

commentRoute.get('/:blogId', allComment);

export default commentRoute;