import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// export const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authenticate