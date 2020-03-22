import Koa from 'koa'

import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import koaConvert from 'koa-convert'
import helmet from 'koa-helmet'
import views from 'koa-views'
import morgan from 'koa-morgan'
import path from 'path'
import { MongoClient } from 'mongodb'

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
import SimplePositionStore from './service/SimplePositionStore'
import SimpleTransactionLog from './service/SimpleTransactionLog';
import { HttpError } from './util/AppProviderTypes'


const app = new Koa();
const api = new KoaRouter()

async function initServer() {

  /* State */
  //TODO: refresh state from somewhere...
  //TODO: config
  const mongoUrl = Config.MONGO_URL;
  const mongoClient = await MongoClient.connect(mongoUrl)
  // var collection = mongoClient.db().collection('documents');
  // console.log("collection is", collection)

  const accountStore = new AccountStore(mongoClient.db())
  const positionStore = new SimplePositionStore(mongoClient.db(), Config.INITIAL_POSITION)
  const txLog = new SimpleTransactionLog(mongoClient.db())

  /* Register API Routes */
  api
    .use('/health', healthCheckRouter.routes())
    .use('/admin', adminRouter.routes()) //Temp mobile money api test
    .use('/mm', mmRouter.routes()) //Temp mobile money api test
    .use('/adapter', adapterRouter.routes()) //handle callbacks from the scheme-adapter

  /* Register Static Pages TODO: move this to separate route?*/

  // api.use(views(__dirname + '/routes/static/views', {
  //   map: {
  //     html: 'underscore'
  //   }
  // }));

  // This is a less than ideal place, but it's what Typescript dictates
  app.use(views(path.join(__dirname, '/../views'), { extension: 'ejs' }));

  const user = {
    name: {
      first: 'Tobi',
      last: 'Holowaychuk'
    },
    species: 'ferret',
    age: 3
  };

  // TODO: add a 404
  app.use(async function (ctx) {
    await ctx.render('index', { user });
    // await ctx.render('user', { user });
  });

  /* Override Koa's Error Handler*/
  app.context.onerror = errorHandler;

  /* Register Middleware */
  app
    //Simple Error Handling
    .use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        if (err instanceof HttpError) {
          ctx.status = err.getStatus()
          ctx.body = err.getBody()
          ctx.app.emit('error', err, ctx);

          return;
        }
        ctx.status = err.status || 500;
        ctx.body = {
          statusCode: err.status || 500,
          error: err.message,
          message: err.message,
        }
        ctx.app.emit('error', err, ctx);
      }
    })
    //Attach state to context object
    .use(async (ctx, next) => {
      ctx.state.accountStore = accountStore;
      ctx.state.positionStore = positionStore;
      ctx.state.txLog = txLog;

      await next()
    })
    .use(morgan('tiny')) //TODO: configure based on env vars
    .use(helmet())
    .use(koaConvert(bodyParser()))
    // .use(errorResponder)
    .use(api.routes())
    .use(api.allowedMethods())
    .use(koa404Handler)


  /* Centralized error logging */
  app.on('error', (err) => {
    console.log(`[ERROR]`, err)
  });

  /* Start the Server */
  app.listen(Config.PORT, () => {
    Logger.warn(`Server running at: ${Config.HOSTNAME}:${Config.PORT}`)
  });

}

initServer()