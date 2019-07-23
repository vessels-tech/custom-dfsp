import Logger from '../service/logger'

const UNKNOWN_ERROR_CODE = 500;

async function errorResponder(ctx: any, next: any) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || UNKNOWN_ERROR_CODE;
    ctx.body = err.message || '';

    Logger.error(`${ctx.status} response: ${ctx.body}`, { requestId: ctx.requestId });
    if (ctx.status === UNKNOWN_ERROR_CODE) {
      Logger.error(`${err.stack}`, { requestId: ctx.requestId });
    }
  }
}


export default errorResponder
