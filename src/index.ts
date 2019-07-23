import Koa from 'koa'

import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import koaConvert from 'koa-convert'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'

import { rootRouter } from './routes/root.routes'
import { healthCheckRouter } from './routes/healthCheck/healthCheck.routes'
// import errorResponder from './middleware/errorResponder';

//TODO: find/write types for these
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');

const app = new Koa();
const api = new KoaRouter()

/* Register Routes */
api
  .use('/', rootRouter.routes())
  .use('/health', healthCheckRouter.routes())

/* Override Koa's Error Handler*/
app.context.onerror = errorHandler;

/* Register Middleware */
app
  .use(morgan('tiny')) //TODO: configure based on env vars
  .use(helmet())
  .use(koaConvert(bodyParser()))
  // .use(errorResponder)
  .use(api.routes())
  .use(api.allowedMethods())
  .use(koa404Handler)
  
/* Start the Server */
app.listen(3000);