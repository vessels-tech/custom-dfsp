import { Context } from 'koa'
import Boom from '@hapi/boom'

import { credentialsForUser} from '../../model/Account'
import { unsafeUnwrap } from '../../util/AppProviderTypes'
import { Credential, CredentialType } from '../../model/Credential';
import Twilio from '../../service/twilio'

async function sendSms(ctx: Context) {
  const { from, to, message } = ctx.request.body;

  //TODO: Get the account sid and access token from user middleware
  const credentials: Credential[] = unsafeUnwrap(await credentialsForUser('12345'))
  //TODO: change this behaviour, but treat TWILIO as default
  const twilioCredentials = credentials.filter(c => c.type === CredentialType.TWILIO)[0]
  if (!twilioCredentials) {
    throw Boom.notFound(`No credentials of type 'TWILIO' found.`)
  }

  const twilio = new Twilio(twilioCredentials.twilioAccountSid, twilioCredentials.twilioAccessToken)
  const result = unsafeUnwrap(await twilio.sendMessage(from, to, message))

  ctx.body = { ...result }
}

export {
  sendSms
}