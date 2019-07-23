import Koa from 'koa'

import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import koaConvert from 'koa-convert'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'

import { rootRouter } from './routes/root.routes'
import errorResponder from './middleware/error-responder';

const app = new Koa();
const api = new KoaRouter()

/* Register Routes */
api.use('/', rootRouter.routes())


/* Register Middleware */
app
  .use(morgan('tiny')) //TODO: configure based on env vars
  .use(helmet())
  .use(koaConvert(bodyParser()))
  .use(errorResponder)
  .use(api.routes())
  .use(api.allowedMethods());


/* Start the Server */
app.listen(3000);