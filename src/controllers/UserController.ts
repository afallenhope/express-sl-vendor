import { NextFunction, query, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';
import { User } from '../database/entities/UserEntity';
import UserService from '../services/UserService';
import CreateUserDto from '../dtos/CreateUserDto';
import IResponse from '../interfaces/IResponse';

export class UserController {
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const all = await UserService.getAllUsers();
            return response.status(200).json(all);
        } catch (e) {
            const error = e as Error
            return response.status(500).json({ statusCode: 500, message: error.message });
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        if (!isUUID(id)) {
            return response.status(400).json({ message: 'invalid request' });
        }
        try {
            const foundUser = await UserService.getUserByUuid(id);
            if (foundUser instanceof User) {
                return response.status(200).json({ message: foundUser });
            } else if (foundUser === 404) {
                return response.status(404).json({ message: 'user not found' });
            }
        } catch (ex: any) {
            return response.status(500).json({ message: ex.message });
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { avKey, firstName, lastName, username } = request.body;

        try {
            const savedUser: number | IResponse | User = await UserService.createUser({
                avKey,
                firstName,
                lastName,
                username,
            } as CreateUserDto);

            if (savedUser === 400) {
                return { statusCode: 400, message: 'bad request' };
            } else if (savedUser === 409) {
                return { statusCode: 409, message: 'user already exists' }
            }

            if (savedUser instanceof User) {
                return { statusCode: 201, message: savedUser };
            }
        } catch (ex) {
            return { statusCode: 500, message: ex };
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const userToRemove = await UserService.removeUserByUuid(id);

            if (userToRemove === 404) {
                return { statusCode: 404, message: 'user not found.' };
            }

            return { statusCode: 204 };
        } catch (ex) {
            return ex;
        }
    }
}
