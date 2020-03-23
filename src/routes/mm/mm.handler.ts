import request from 'request-promise-native'
import Joi from '@hapi/joi'

import Config from '../../service/config'
import AccountStore from '../../service/AccountStore';
import {  
  httpUnwrap, HttpError,
} from '../../util/AppProviderTypes';
import { Account } from '../../model/Account';
import SimplePositionStore from '../../service/SimplePositionStore';
import SimpleTransactionLog from '../../service/SimpleTransactionLog';
import { RouterContext } from 'koa-router';

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

export async function getAccount(ctx: RouterContext) {
  const { idValue } = ctx.params; //we ignore the id type for now
  const accountStore: AccountStore = ctx.state.accountStore;
  
  const account = httpUnwrap(await accountStore.getAccount(idValue))
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
export async function registerAccount(ctx: RouterContext) {
  const { idType, idValue, name, funds } = ctx.request.body;
  //TODO: validate
  const accountStore: AccountStore = ctx.state.accountStore;
  const newAccount: Account = {
    idType, 
    idValue, 
    name,
    funds: parseFloat(funds) //Google sheets sends a string even though it should be a number
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
export async function transfer(ctx: RouterContext) {
  const accountStore: AccountStore = ctx.state.accountStore;
  const positionStore: SimplePositionStore = ctx.state.positionStore;
  const txLog: SimpleTransactionLog = ctx.state.positionStore;


  console.log("transfer request.body", ctx.request.body)

  //TODO: use middleware to validate
  const schema = Joi.object().keys({
    //Hacky alternative as Google's Spreadheets URLFetch doesn't nest JSON properly
    fromDisplayName: Joi.string().optional(),
    fromIdType: Joi.string().allow(['MSISDN']).required(),
    fromIdValue: Joi.string().required(),
    toIdType: Joi.string().allow(['MSISDN']).required(),
    toIdValue: Joi.string().required(),
    amount: Joi.string().regex(/^([0]|([1-9][0-9]{0,17})).([0-9]*)$/).required(), //TODO put in money regex
    note: Joi.string().optional()
  })
  const validationResult = schema.validate(ctx.request.body)
  if (validationResult.error) {
    throw new HttpError(400, validationResult.error.message)
  }
  const transfer = validationResult.value

  /* DFSP Validation */
  if (transfer.fromIdValue === transfer.toIdValue) {
    throw new HttpError(400, `Cannot send funds to self`)
  }
  const account = httpUnwrap(await accountStore.getAccount(transfer.fromIdValue))
  const amountNum = parseFloat(transfer.amount)
  if (account.funds < amountNum) {
    throw new HttpError(400, `Account does not have enough funds for transfer.`)
  }

  /* Forward to Scheme Adapter */
  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers`,
    method: 'POST',
    json: true,
    simple: true,
    headers: buildHeaders(),
    body: {
      ...transfer,
      from: {
        idType: transfer.fromIdType,
        idValue: transfer.fromIdValue,
      },
      to: {
        idType: transfer.toIdType,
        idValue: transfer.toIdValue,
      },
      amountType: 'SEND',
      currency: Config.CURRENCY,
      transactionType: 'TRANSFER',
      homeTransactionId: '123ABC'
    }
  }
  
  //TODO: this only fails on timeout if the party can't be found
  //I think that's an issue in the scheme adapter, not this implementation
  await request(options)

  /* Transfer succeeded, deduct from user's account */
  accountStore.deductFundsFromAccount(transfer.fromIdValue, amountNum * -1)

  /* Deduct from the DFSP's Position */
  positionStore.changePosition(amountNum * -1)

  /* Add to the tx log */
  //TODO: double check the format we are saving
  txLog.appendTransaction(options.body);


  /* Response */
  ctx.response.status = 200;
  ctx.response.body = {
    processed: true
  }
}
