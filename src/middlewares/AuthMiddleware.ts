import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../database/entities/UserEntity';

dotenv.config();

const AuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decode: any = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extend the Request class to include "currentUser"
    (req as Request & { currentUser: User }).currentUser = decode;
};

export default AuthenticationMiddleware;
