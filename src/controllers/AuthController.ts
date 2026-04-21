import { Link } from '../database/entities/LinkEntity';
import { AppDataSource } from '../config/data-source';
import { NextFunction, Request, Response } from 'express';
import DateHelper from '@app/helpers/DateHelper';
import EnvHelper from '@app/helpers/EnvHelper';

const LINK_EXPIRATION: number = +EnvHelper.getEnv('LINK_EXPIRATION', '15');
export class AuthController {
    private linkRepository = AppDataSource.getRepository(Link);

    async login(req: Request, res: Response, next: NextFunction) {
        const { avkey, token } = req.params;

        try {
            const foundLink = await this.linkRepository.findOne({
                where: {
                    user: { avKey: avkey },
                    magicLink: token
                },
                relations: ['user']
            });

            if (foundLink === null) {
                return {
                    statusCode: 404, status: 'Link not Found', message: 'Link Not Found'
                };
            }

            const today = new Date();
            const past = new Date(foundLink.createdAt);
            const diff = DateHelper.dateDiffInMinutes(today, past);

            if (diff <= LINK_EXPIRATION) {
                await this.linkRepository.remove(foundLink);
                return { statusCode: 200, status: 'OK', message: 'loggedin' };
            } else {
                await this.linkRepository.remove(foundLink);
                return { statusCode: 440, status: 'Session Expired', message: 'Link Expired.' };
            }
        } catch (e) {
            const error = e as Error;
            return {
                statusCode: 500, message: error.message
            }
        }
    }
}
