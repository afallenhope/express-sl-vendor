import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './router';
import ErrorHandlerMiddleware from './middlewares/ErrorHandlerMiddleware';

const allOther = (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        message: 'Bad Request'
    });
}

const app: Express = express();

app.use(cors()); // cors for our front-end
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse URL encoded params
app.use(ErrorHandlerMiddleware); // custom middleware fro error handling.
app.use('/api/v1', router); // prefix all routes /api/v1/<routeshere>
app.get('*', allOther); // if the route isn't found, then run the  `allOther` callback

export default app;
