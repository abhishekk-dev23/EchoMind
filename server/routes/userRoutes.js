import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/userControllers.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);

userRouter.post('/login', login);

userRouter.post('/logout', logout);

userRouter.get('/check', protectRoute, checkAuth);

userRouter.put('/update-profile', protectRoute, updateProfile);

export default userRouter;
