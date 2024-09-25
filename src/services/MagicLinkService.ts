import IResponse from '../interfaces/IResponse';
import { AppDataSource } from '../config/data-source'
import { AppDataSourceTest } from '../config/data-source-test';
import { Link } from '../database/entities/LinkEntity';
import { User } from '../database/entities/UserEntity'
import AuthHelper from '../helpers/AuthHelper';
import DateHelper from '../helpers/DateHelper';
import EnvHelper from '../helpers/EnvHelper';


const userRepository = EnvHelper.getEnv('NODE_ENV', 'dev') === 'test' ?
    AppDataSourceTest.getRepository(User) :
    AppDataSource.getRepository(User);

const linkRepository = EnvHelper.getEnv('NODE_ENV', 'dev') === 'test' ?
    AppDataSourceTest.getRepository(Link) :
    AppDataSource.getRepository(Link);

const LINK_EXPIRATION = +(EnvHelper.getEnv('LINK_EXPIRATION', '5'));

class MagicLinkService {

    static async generateLink(avKey: string, callbackUrl: string): Promise<number | IResponse | Link> {
        try {
            const foundUser = await userRepository.findOneBy({ avKey });

            if (foundUser === null) {
                return Promise.resolve(404);
            }

            const foundLink = await linkRepository.findOne({
                where: {
                    user: { avKey: foundUser.avKey },
                },
                relations: ['user']
            });

            if (foundLink !== null) {
                //const today = new Date();
                //const past = new Date(foundLink.createdAt);
                //console.log(DateHelper.dateDiffInMinutes(today, past));
                return Promise.resolve(409);
            }

            const token = AuthHelper.randomString(50);
            const link = new Link();
            link.user = foundUser;
            link.magicLink = token;
            link.callbackUrl = callbackUrl;

            return await linkRepository.save(link);
        } catch (e) {
            const error = e as Error;
            return Promise.reject({ statusCode: 500, message: error.message });
        }
    }

    static async validate(avKey: string, token: string,): Promise<number | IResponse | Link> {
        try {
            const foundLink = await linkRepository.findOne({
                where: {
                    user: { avKey },
                    magicLink: token
                },
                relations: ['user']
            });


            if (foundLink === null) {
                return Promise.resolve(404);
            }

            const today = new Date();
            const past = new Date(foundLink.createdAt);
            const diff = DateHelper.dateDiffInMinutes(today, past);

            if (diff <= LINK_EXPIRATION) {
                await linkRepository.remove(foundLink);
                return Promise.resolve(foundLink);
            } else {
                await linkRepository.remove(foundLink);
                return Promise.resolve(440);
            }
        } catch (e) {
            const error = e as Error;
            return Promise.reject({
                statusCode: 500, message: error.message
            })
        }
    }
}

export default MagicLinkService;
