import { NextFunction, Request, Response } from "express";
import { argv0 } from "process";

const SLValidator = (req: Request, res: Response, next: NextFunction) => {
    const headerKeys = Object.keys(req.headers);
    const userAgent = req.headers['user-agent'];

    const secondlifeHeaders = headerKeys.filter((key) => key.toLowerCase().startsWith('x-secondlife-'));

    if (secondlifeHeaders.length === 0 || (userAgent !== undefined && !userAgent.startsWith('Second-Life-LSL'))) {
        return res.status(400).json({ status: 400, message: 'Bad Request' });
    }

    next();
};

export default SLValidator;
