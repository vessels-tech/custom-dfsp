import KoaRouter from 'koa-router'

import { root } from './root.handler'

/**
 * Root routes: just return the API name.
 */
const rootRouter = new KoaRouter()
rootRouter.get('/', root);


export {
  rootRouter
}
