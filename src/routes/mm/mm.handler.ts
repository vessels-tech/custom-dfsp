import { Context } from 'koa'
import request from 'request-promise-native'

import Config from '../../service/config'
import AccountStore from '../../service/AccountStore';
import { 
  // unsafeUnwrap, 
  ResultType,
} from '../../util/AppProviderTypes';
import { Account } from '../../model/Account';

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

export async function getAccount(ctx: Context) {
  const { idValue } = ctx.params; //we ignore the id type for now
  const accountStore: AccountStore = ctx.state.accountStore;
  
  const getAccountResult = accountStore.getAccount(idValue)
  // TODO: make more generic
  if (getAccountResult.type === ResultType.ERROR) {
    ctx.status = 404
    ctx.body = {
      statusCode: 404,
      error: "Not found",
      message: "Account not found"
    }

    return
  }

  const account = getAccountResult.result
  ctx.body = {
    statusCode: 200,
    data: account
  }
}


/**
 * @function registerAccount
 * 
 * @description Tell the switch to register an account with this dfsp
 */
export async function registerAccount(ctx: Context) {
  const { idType, idValue, name, funds } = ctx.request.body;
  //TODO: validate
  const accountStore: AccountStore = ctx.state.accountStore;
  const newAccount: Account = {
    idType, 
    idValue, 
    name,
    funds,
  }

  accountStore.addAccount(newAccount)
  
  ctx.status = 201
  ctx.body = {
    statusCode: 201,
    message: 'Created new account'
  }
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
