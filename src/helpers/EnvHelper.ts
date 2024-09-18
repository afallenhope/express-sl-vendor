import * as dotenv from 'dotenv';

dotenv.config();

class EnvHelper {
    static getEnv(setting: string, defaultValue: string): string {
        return process.env[setting] || defaultValue;
    }
}

export default EnvHelper;
