import { IRoute } from '../../../interfaces/IRoute';
import MagicLinkController from '../../../controllers/MagicLinkController';
import SLValidator from '../../../middlewares/SLValidatorMiddleware';

const LinkRoutes: IRoute[] = [
  {
    method: 'post',
    route: '/checkin',
    middlewares: [SLValidator],
    controller: MagicLinkController,
    action: 'generate',
  },
  {
    method: 'get',
    route: '/login/:avkey/:token',
    controller: MagicLinkController,
    action: 'login',
  },
]

export default LinkRoutes;
