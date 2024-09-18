import { AppDataSource } from './config/data-source';
import app from './app';
import EnvHelper from './helpers/EnvHelper';

const PORT: number = +EnvHelper.getEnv('SERVER_PORT', '3000');
const HOST: string = EnvHelper.getEnv('SERVER_HOST', '0.0.0.0');

const entrypoint = () => {
    console.log(`💻 Server Running @ http://${HOST}:${PORT}`);
};

AppDataSource.initialize().then(async () => {
    app.listen(PORT, HOST, entrypoint);
}).catch((error) => console.log(error));
