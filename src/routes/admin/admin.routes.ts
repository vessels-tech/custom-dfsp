import KoaRouter from 'koa-router'

import { getAccounts } from './admin.handler'


const adminRouter = new KoaRouter()
adminRouter.get('/accounts', getAccounts);


export {
  adminRouter
}
