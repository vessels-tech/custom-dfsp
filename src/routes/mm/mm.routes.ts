import KoaRouter from 'koa-router'

import { shallow } from '../healthCheck/healthCheck.handler'
import {
  transfer,
  getAccount,
  registerAccount,
} from './mm.handler'

const mmRouter = new KoaRouter()

mmRouter.get('/health', shallow);
mmRouter.get('/account/:idType/:idValue', getAccount) //get an account, name, funds etc
mmRouter.post('/account', registerAccount) //sign up for an account
mmRouter.post('/transfer', transfer); //make a transfer from one account to another

export {
  mmRouter
}
