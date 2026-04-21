import { ToolController } from '../../../controllers/ToolController';
import { IRoute } from '../../../interfaces/IRoute';

const ToolRoutes: IRoute[] = [
  {
    method: 'post',
    route: '/shape-combiner',
    controller: ToolController,
    action: 'combineShape'
  },
]

export default ToolRoutes;
