import { DataSource } from "typeorm";
import { HttpMethod } from "../types/HttpMethod";
import IMiddleware from "./IMiddleware";

export interface IRoute {
    method: HttpMethod
    route: string;
    dataSource?: DataSource;
    middlewares?: IMiddleware[];
    controller: any;
    action: string;
}

