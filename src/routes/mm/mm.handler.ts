import { Context } from 'koa'

import mlClient from '../../service/mlClient'
import Config from '../../service/config'
import { 
  IdType,
  Party,
} from '../../model/InboundApiTypes'

import request from 'request-promise-native'

/**
 * Utility method to build a set of headers required by the SDK outbound API
 *
 * @returns {object} - Object containing key/value pairs of HTTP headers
 */
const buildHeaders = () => {
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Date': new Date().toUTCString(),
    'fspiop-source': Config.DFSP_ID,
  };

  return headers;
};

//TODO: I still feel like I have this the wrong way around...


export async function getAccount(ctx: Context) {
  ctx.body = true
}


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


/**
 * @function transfer
 * 
 * @description Transfer funds from our account to another
 * @param ctx 
 */
export async function transfer(ctx: Context) {

  /*
    TODO internally:
    - check that the user exists
    - check that the user has enough funds for the tx
  
  */

  //Send the transfer to the scheme adapter to take care of
  //This seems to just be forwarding it straight onto the switch
  //The scheme adapter isn't doing anything for us here...

  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers`,
    method: 'POST',
    json: true,
    headers: buildHeaders(),
    body: {
      "from": {
        "displayName": "John Doe",
        "idType": "MSISDN",
        "idValue": "123456789"
      },
      "to": {
          "idType": "MSISDN",
          "idValue": "987654321"
      },
      "amountType": "SEND",
      "currency": "AUD",
      "amount": "100",
      "transactionType": "TRANSFER",
      "note": "test payment",
      "homeTransactionId": "123ABC",
    }
  }
  console.log("executing POST", options.url)

  try {
    await request(options)

    //If this succeeds, deduct from the user's account? Is that how this works?

    ctx.response.status = 200;
    ctx.response.body = {processed: true}

  } catch (err) {
    
    ctx.response.status = 500;
    ctx.response.body = {
      message: err.message || 'Unspecified error'
    };
  }
}
