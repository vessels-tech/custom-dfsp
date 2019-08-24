import KoaRouter from 'koa-router'


import { shallow } from '../healthCheck/healthCheck.handler'
import {
  lookupAccount,
} from './mm.handler'

const mmRouter = new KoaRouter()

mmRouter.get('/health', shallow);
mmRouter.get('/lookup/:idValue', lookupAccount)


export {
  mmRouter
}
