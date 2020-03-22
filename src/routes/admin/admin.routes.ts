import KoaRouter from 'koa-router'
import { 
  getAccounts,
  cashIn,
  getPosition,
} from './admin.handler'


const adminRouter = new KoaRouter()
adminRouter.get('/accounts', getAccounts);
adminRouter.post('/cashin/:idType/:idValue', cashIn) //add funds to user's account
adminRouter.get('/position', getPosition) //get the position of the dfsp

export {
  adminRouter
}
