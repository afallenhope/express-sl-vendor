import { NextFunction, Request, RequestHandler, Response } from "express";

interface IMiddleware extends RequestHandler {
}

export default IMiddleware;
