import koaRouter from 'koa-router'
import { shallow } from './healthCheck.handler'

/**
 * Health check routes: used by load balancers to determine if traffic should
 * be routed to nodes.
 */
const healthCheckRouter = new koaRouter()
  .get('/', shallow)
  // .get('/deep', deep);

export { healthCheckRouter };
