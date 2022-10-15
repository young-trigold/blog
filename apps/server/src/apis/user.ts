import { Router } from 'express';

import userController from '../controllers/user.js';
import protect from '../middlewares/auth.js';

const userApi = Router();

userApi.post('/register', userController.register);
userApi.post('/login', userController.login);
userApi.get('/userInfo', protect, userController.getUserInfo);

export default userApi;
