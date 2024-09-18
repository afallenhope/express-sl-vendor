import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

class AuthHelper {
    static encrypt(password: string): string {
        return bcrypt.hashSync(password, 13);
    }

    static comparePassword(hashedPassword: string, password: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    static generateJWTToken(payload: any): string {
        const { JWT_SECRET, JWT_EXPIRATION } = process.env;
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    }

    static randomString(length: number): string {
        return btoa(String.fromCharCode(...crypto.randomBytes(length * 2)))
            .replace(/[+/]/g, "")
            .substring(0, length);
    }

}

export default AuthHelper;
