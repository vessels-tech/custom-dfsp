import { Context } from 'koa'

import mlClient from '../../service/mlClient'

import { 
  ParticipantsResponse, 
  IdType,
} from '../../model/InboundApiTypes'

export async function lookupAccount(ctx: Context) {
  //TODO: lookup an account given a phone number by calling through to the ALS

  await mlClient.getParties(IdType.ACCOUNT_ID, "+61404404404")

  //Temp mock response
  const response: ParticipantsResponse = {
    fspId: 'glasper'
  }

  ctx.body = response
}


