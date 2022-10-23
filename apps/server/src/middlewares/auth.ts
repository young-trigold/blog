import jwt, { JwtPayload } from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
      res.status(401).json({ message: '未授权!' });
    else {
      const token = req.headers.authorization.split(' ')[1];

      const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      req.user = JSON.parse(decodedUser.id);
      next();
    }
  } catch (error) {
    if (error instanceof Error)
      res.status(403).json({ message: '请重新登录!', stack: error.stack });
  }
};

export default protect;
