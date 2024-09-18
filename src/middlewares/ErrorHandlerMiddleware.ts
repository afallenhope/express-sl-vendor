import { NextFunction, Request, Response } from "express";

const ErrorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction) => {

    //console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: `Internal server eror: ${error.message}` });
};

export default ErrorHandlerMiddleware;
