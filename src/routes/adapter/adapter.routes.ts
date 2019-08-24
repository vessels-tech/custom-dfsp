import KoaRouter from 'koa-router'


import { shallow } from '../healthCheck/healthCheck.handler'
import {
  getParticipants,
  getParties,
  postQuoteRequests,
  postTransfers,
} from './adapter.handler'

/*
  Router for handling requests from the scheme-adapter
*/
const router = new KoaRouter()

router.get('/health', shallow);
router.get('/participants/:idType/:idValue', getParticipants) //I don't think we will use getParticipants, but getParties instead
router.get('/parties/:idType/:idValue', getParties)
router.post('/quoterequests', postQuoteRequests)
router.post('/transfers', postTransfers)


export default router
