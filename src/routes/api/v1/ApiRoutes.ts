import { ApiController } from '../../../controllers/ApiController';
import { IRoute } from '../../../interfaces/IRoute';

const ApiRoutes: IRoute[] = [
  {
    method: 'get',
    route: '/',
    controller: ApiController,
    action: 'index',
  },
]
export default ApiRoutes;

