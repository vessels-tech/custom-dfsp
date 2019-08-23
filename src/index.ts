import Koa from 'koa'

import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import koaConvert from 'koa-convert'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'

//TODO: find/write types for these
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');

// import { rootRouter } from './routes/root.routes'
import { healthCheckRouter } from './routes/healthCheck/healthCheck.routes'
// import { adminRouter } from './routes/admin/admin.routes'
// import { smsRouter } from './routes/sms/sms.routes'
import Config from './service/config';
import Logger from './service/logger';


const app = new Koa();
const api = new KoaRouter()

/* Register Routes */
api
  .use('/health', healthCheckRouter.routes())
//   .use('/', rootRouter.routes())
//   .use('/admin', adminRouter.routes())
//   .use('/sms', smsRouter.routes())

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
app.listen(Config.PORT, () => {
  Logger.warn(`Server running at: ${Config.HOSTNAME}:${Config.PORT}`)
});