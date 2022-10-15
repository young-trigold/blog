import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const register = async (req: Request, res: Response) => {
  const { name, pwd } = req.body;

  try {
    const userWithSameName = await User.findOne({ name });

    if (userWithSameName) {
      res.status(409).json({ message: '该用户已经存在!' });
    } else {
      const cypheredPwd = await bcrypt.hash(pwd, 10);

      const newUser = new User({
        name,
        pwd: cypheredPwd,
        role: 'visitor',
      });

      await newUser.save();
      res.status(200).json({ message: '注册成功!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const createToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

const login = async (req: Request, res: Response) => {
  try {
    const { name, pwd } = req.body;
    const user = await User.findOne({ name });

    if (user) {
      const isPass = await bcrypt.compare(pwd, user.pwd!);

      if (isPass) {
        res.status(200).json({
          token: createToken(JSON.stringify({ id: user._id, role: user.role, name: user.name })),
        });
      } else {
        res.status(401).json({ message: '密码不匹配!' });
      }
    } else {
      res.status(404).json({ message: '不存在该用户!' });
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: '服务器错误!', stack: error.stack });
  }
};

const getUserInfo = async (req: Request, res: Response) => {
  const { user } = req;
  res.status(200).json(user);
};

const UserController = {
  register,
  login,
  getUserInfo,
};

export default UserController;
