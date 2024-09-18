import express, { Router, Request, Response, NextFunction } from 'express';
import { HttpMethod } from './types/HttpMethod';
import ApiRoutes from './routes/api/v1/ApiRoutes';
import { IRoute } from './interfaces/IRoute';
import UserRoutes from './routes/api/v1/UserRoutes';
import IMiddleware from './interfaces/IMiddleware';
import LinkRoutes from './routes/api/v1/LinkRoutes';

const router: Router = express.Router();

const allRoutes = [ApiRoutes, UserRoutes, LinkRoutes];

/**
 *
 * registerRoute(route: IRoute)
 *
 * @description register routes with our router.
 *
 * @param {IRoute} route - the route object
 * @return {string | IResponse} - response object
 */
function registerRoute(route: IRoute) {
    let middlewares: IMiddleware[] = route.middlewares || [];

    const routeHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const controllerInstance = new (route.controller as any)();
            const result = await controllerInstance[route.action](req, res, next);
            // NOTE:
            // I'm not enirely sure if I want to handle the response here or in the controller
            // at this time, I'm using the controller, but I may use a custom response object
            // and return from there. 
            // ...
            // this is a router after all...
            if (result && result.statusCode) {
                return res.status(result.statusCode).json(result);
            } else {
                return res.json(result);
            }
        } catch (error) {
            next(error);
        }
    };

    (router as Router)[route.method as HttpMethod](route.route, ...middlewares, routeHandler);
}

allRoutes.forEach((routeList) => {
    routeList.forEach((route: IRoute) => {
        //console.log(`Registering route: ${route.method.toUpperCase()} ${route.route}`);
        registerRoute(route);
    });
});

// NOTE: This is being commented out for now
//       as we're handling this above, but if we were not using middleware
//       then this would be fine.
//
//allRoutes.forEach((routeList) => {
//    routeList.forEach((route: IRoute) => {
//        console.log(`Registering route: ${route.method.toUpperCase()} ${route.route}`);
//        (router as Router)[route.method as HttpMethod](
//            route.route,
//            async (req: Request, res: Response, next: NextFunction) => {
//                try {
//                    const controllerInstance = new (route.controller as any)();
//                    const result = await controllerInstance[route.action](req, res, next);
//
//                    // NOTE:
//                    // I'm not enirely sure if I want to handle the response here or in the controller
//                    // at this time, I'm using the controller, but I may use a custom response object
//                    // and return from there. 
//                    // ...
//                    // this is a router after all...
//                    //
//                    //if (result !== null && result !== undefined) {
//                    //    res.json(result);
//                    //} else {
//                    //    res.status(204).send();
//                    //}
//                } catch (error) {
//                    next(error); // Pass error to error handling middleware
//                }
//            }
//        );
//    });
//});
export default router;

