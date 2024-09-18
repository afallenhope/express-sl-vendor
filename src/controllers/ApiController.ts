import ResponseOK from "../responses/ResponseOK";
import { NextFunction, Request, Response } from "express";

export class ApiController {
    async index(request: Request, response: Response, next: NextFunction) {
        const ok = new ResponseOK();
        ok.message = 'OK';
        return ok;
    }
}
