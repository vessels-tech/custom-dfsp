import { Context } from 'koa'

async function sendSms(ctx: Context) {

  //TODO: Get the account sid and access token from user middleware

  


  ctx.body = { status: "OK"}
}

export {
  sendSms
}