import KoaRouter from 'koa-router'


import { shallow } from '../healthCheck/healthCheck.handler'
import {
  transfer,
  lookupAccount,
  registerAccount,
} from './mm.handler'

const mmRouter = new KoaRouter()

mmRouter.get('/health', shallow);
mmRouter.post('/transfer', transfer);
mmRouter.post('/register', registerAccount)
mmRouter.get('/lookup/:idValue', lookupAccount)

export {
  mmRouter
}
