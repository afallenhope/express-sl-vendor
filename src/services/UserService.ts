import CreateUserDto from "@app/dtos/CreateUserDto";
import { AppDataSource } from "../config/data-source";
import { User } from "../database/entities/UserEntity";
import IResponse from "@app/interfaces/IResponse";


const userRepository = AppDataSource.getRepository(User);

class UserService {

    static async getUserById(id: string): Promise<number | User> {
        const foundUser = await userRepository.findOne({
            where: { id },
        });

        if (!foundUser) {
            return Promise.resolve(404);
        }

        return Promise.resolve(foundUser);
    }

    static async getUserByUuid(avKey: string): Promise<number | User> {
        try {
            const foundUser = await userRepository.findOne({
                where: { avKey },
            });

            if (foundUser === null) {
                return Promise.resolve(404);
            }

            return Promise.resolve(foundUser);
        } catch (ex) {
            const error = ex as Error
            return Promise.reject({ statusCode: 500, message: error });
        }
    }

    static async createUser(createUserDto: CreateUserDto): Promise<number | IResponse | User> {

        try {
            const { avKey, firstName, lastName, username } = createUserDto;

            const foundUser = await userRepository.findOneBy({ avKey });

            if (foundUser) {
                console.log('User', foundUser);
                return Promise.resolve(409);
            }

            if ((avKey === undefined || avKey === null) ||
                (firstName === undefined || firstName === null) ||
                (lastName === undefined || lastName === null) ||
                (username === undefined || username === null)) {
                return Promise.resolve(400);
            }

            const user = new User();
            user.username = username;
            user.firstName = firstName;
            user.lastName = lastName;
            user.avKey = avKey

            const savedUser = await userRepository.save(user);
            return Promise.resolve(savedUser);
        } catch (e) {
            const error: Error = e as Error;
            return Promise.reject({ statusCode: 500, message: error.message });
        }
    }

    static async getAllUsers(): Promise<number | IResponse | User[]> {
        try {
            const all = await userRepository.find({ relations: ['store', 'link'] });
            return Promise.resolve(all);
        } catch (e) {
            const error: Error = e as Error;
            return Promise.reject({ statusCode: 500, message: error.message });
        }
    }
}

export default UserService;
