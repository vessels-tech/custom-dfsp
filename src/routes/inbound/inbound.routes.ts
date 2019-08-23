import KoaRouter from 'koa-router'


import { shallow } from '../healthCheck/healthCheck.handler'
import {
  getParticipants,
  getParties,
  postQuoteRequests,
  postTransfers,
} from './inbound.handler'

const inboundRouter = new KoaRouter()

inboundRouter.get('/health', shallow);
inboundRouter.get('/participants/:idType/:idValue', getParticipants)
inboundRouter.get('/parties/:idType/:idValue', getParties)
inboundRouter.post('/quoterequests', postQuoteRequests)
inboundRouter.post('/transfers', postTransfers)


export {
  inboundRouter
}
