import axios, { Axios } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { Link } from '../database/entities/LinkEntity';
import MagicLinkService from '../services/MagicLinkService';


class MagicLinkController {

    async generate(req: Request, res: Response, next: NextFunction) {
        const { headers } = req;
        const { callbackUrl } = req.body;

        const secondlifeHeaders = Object.keys(headers)
            .filter((key) => key.toLowerCase().startsWith('x-secondlife-'));

        const avKey = headers['x-secondlife-requested-by']?.toString();

        try {
            if (avKey === undefined || callbackUrl === undefined) {
                return {
                    statusCode: 400, status: 'BAD_REQUEST', message: 'Invalid Data',
                };
            }

            const link = await MagicLinkService.generateLink(avKey, callbackUrl);

            if (link === 409) {
                return {
                    statusCode: 409,
                    status: 'CONFLICT_LINK',
                    message: 'Link Exists already.'
                };
            } else if (link === 404) {
                return {
                    statusCode: 404,
                    status: 'NOT_FOUND_USER',
                    message: 'User not found'
                };
            } else if (link instanceof Link) {
                return {
                    statusCode: 200,
                    status: 'OK_CODE',
                    message: link?.magicLink
                };
            }
        } catch (e: any) {
            const error = e as Error;
            return {
                statusCode: 500,
                message: `GENERATE LINK: ${error.message}`
            }
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { avkey, token } = req.params;

        try {
            const result = await MagicLinkService.validate(avkey, token);

            if (result instanceof Link) {
                // NOTE: At this time, I don't want to use MFA,
                // however, this would be a good idea for a type of MFA
                // Having SL generate a DNS-IN and sending a command to have
                // user validate.
                //
                // for now, I'm omiting this.
                //const response = await axios.get(result.callbackUrl);
                //if (response.status === 200) {
                //    const { data } = response;
                //    console.log('Received', data);
                //}

                return { statusCode: 200, status: 'OK_CHALLENGE', message: 'challenged code' };
            } else if (result === 404) {
                return {
                    statusCode: 404, status: 'NOT_FOUND_LINK', message: 'Link Not Found'
                };
            } else if (result === 440) {
                return { statusCode: 440, status: 'SE_EXPIRED', message: 'Link Expired.' };
            }
        } catch (e) {
            const error = e as Error;
            return {
                statusCode: 500, message: error.message
            }
        }

    }
}

export default MagicLinkController;
