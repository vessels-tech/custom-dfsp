import Koa from 'koa'

import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import koaConvert from 'koa-convert'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'

//TODO: find/write types for these
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');

import { healthCheckRouter } from './routes/healthCheck/healthCheck.routes'
import { mmRouter } from './routes/mm/mm.routes'
import { adminRouter } from './routes/admin/admin.routes';
import adapterRouter  from './routes/adapter/adapter.routes'
import Config from './service/config';
import Logger from './service/logger';
import AccountStore from './service/AccountStore'


const app = new Koa();
const api = new KoaRouter()

/* State */
//TODO: refresh state from somewhere...
const accountStore = new AccountStore()

/* Register Routes */
api
  .use('/health', healthCheckRouter.routes())
  .use('/admin', adminRouter.routes()) //Temp mobile money api test
  .use('/mm', mmRouter.routes()) //Temp mobile money api test
  .use('/adapter', adapterRouter.routes()) //handle callbacks from the scheme-adapter

/* Override Koa's Error Handler*/
app.context.onerror = errorHandler;


/* Register Middleware */
app
  //Attach state to context object
  .use(async (ctx, next) => {
    ctx.state.accountStore = accountStore;

    await next()
  })
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