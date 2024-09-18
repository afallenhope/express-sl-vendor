import { IRoute } from "../../../interfaces/IRoute";
import { UserController } from '../../..//controllers/UserController';
import AuthenticationMiddleware from "../../../middlewares/AuthMiddleware";

const UserRoutes: IRoute[] = [
  {
    method: 'get',
    route: '/users',
    middlewares: [AuthenticationMiddleware],
    controller: UserController,
    action: 'all'
  },
  {
    method: 'get',
    route: '/users/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/users',
    controller: UserController,
    action: 'save'
  },
  {
    method: 'delete',
    route: '/users/:id',
    controller: UserController,
    action: 'remove'
  }
];

export default UserRoutes;
