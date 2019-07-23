import koaRouter from 'koa-router'
import { sendSms } from './sms.handler'

import Joi from '@hapi/joi'
// import validate from 'koa-joi-validate'
const validate = require('koa-joi-validate')

const sendSmsValidator = validate({
  request: {
    body: {
      // username: Joi.string().required(),
      // password: Joi.string().required()
      from: Joi.string().required(),
      to: Joi.string().required(),
      body: Joi.string().required(),
    }
  }
})


const smsRouter = new koaRouter()
  .post('/', sendSmsValidator, sendSms)

export { smsRouter }
