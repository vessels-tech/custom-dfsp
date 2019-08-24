import { Context } from 'koa'

import mlClient from '../../service/mlClient'
import Config from '../../service/config'
import { 
  ParticipantsResponse, 
  IdType,
  Party,
} from '../../model/InboundApiTypes'

//TODO: I still feel like I have this the wrong way around...

/**
 * @function registerAccount
 * 
 * @description Tell the switch to register an account with this dfsp
 */
export async function registerAccount(ctx: Context) {

  //TODO: read the MSISDN number from the req.body
  const msisdn = "+61404404404"
  const party: Party = {
    partyIdInfo: {
      partyIdType: IdType.MSISDN,
      partyIdentifier: msisdn,
      // partySubIdOrType: String,
      fspId: Config.DFSP_ID
    },
    name: 'Robert Glasper',
    personalInfo: {
      complexName: {
        firstName: 'Robert',
        lastName: 'Glasper',
      },
      dateOfBirth: '1974-01-01',
    }
  }
  
  const body = { party }
  await mlClient.putParties(IdType.MSISDN, msisdn, JSON.stringify(body), Config.DFSP_ID)

  ctx.body = true
}

export async function lookupAccount(ctx: Context) {
  //TODO: lookup an account given a phone number by calling through to the ALS

  //TODO: wrap this with some nice error handling that passes on errors
  //TODO: wrap this with our nice inline error handling inspired by rust
  // try {
  const getPartiesResponse = await mlClient.getParties(IdType.MSISDN, "+61404404404")
  console.log('getPartiesResponse', getPartiesResponse)
  // } catch (err) {
  //   console.log('err is', err)
  //   throw err
  // }

  //Temp mock response
  const response: ParticipantsResponse = {
    fspId: 'glasper'
  }

  ctx.body = response
}


/**
 * @function transfer
 * 
 * @description Transfer funds from our account to another
 * @param ctx 
 */
export async function transfer(ctx: Context) {



  ctx.body = true;
}
