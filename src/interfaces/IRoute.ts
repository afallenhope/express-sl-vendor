import { HttpMethod } from "../types/HttpMethod";
import IMiddleware from "./IMiddleware";

export interface IRoute {
    method: HttpMethod
    route: string;
    middlewares?: IMiddleware[];
    controller: any;
    action: string;
}

