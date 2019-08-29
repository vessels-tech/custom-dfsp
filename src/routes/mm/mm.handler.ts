import { Context } from 'koa'
import request from 'request-promise-native'
import Joi from '@hapi/joi'

import Config from '../../service/config'
import AccountStore from '../../service/AccountStore';
import {  
  httpUnwrap, HttpError,
} from '../../util/AppProviderTypes';
import { Account } from '../../model/Account';
import SimplePositionStore from '../../service/SimplePositionStore';

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
  
  const account = httpUnwrap(accountStore.getAccount(idValue))
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
  const accountStore: AccountStore = ctx.state.accountStore;
  const positionStore: SimplePositionStore = ctx.state.positionStore;


  //TODO: use middleware to validate
  const schema = Joi.object().keys({
    from: Joi.object().keys({
      displayName: Joi.string().optional(),
      idType: Joi.string().allow(['MSISDN']).required(),
      idValue: Joi.string().required(),
    }).required(),
    to: Joi.object().keys({
      idType: Joi.string().allow(['MSISDN']).required(),
      idValue: Joi.string().required(),
    }).required(),
    amount: Joi.string().regex(/^([0]|([1-9][0-9]{0,17})).([0-9]*)$/).required(), //TODO put in money regex
    note: Joi.string().optional()
  })
  const validationResult = schema.validate(ctx.request.body)
  if (validationResult.error) {
    throw new HttpError(400, validationResult.error.message)
  }
  const transfer = validationResult.value

  /* DFSP Validation */
  if (transfer.from.idValue === transfer.to.idValue) {
    throw new HttpError(400, `Cannot send funds to self`)
  }
  const account = httpUnwrap(accountStore.getAccount(transfer.from.idValue))
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
      from: transfer.from,
      to: transfer.to,
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
  accountStore.deductFundsFromAccount(transfer.from.idValue, amountNum * -1)

  /* Deduct from the DFSP's Position */
  positionStore.changePosition(amountNum)


  /* Response */
  ctx.response.status = 200;
  ctx.response.body = {
    processed: true
  }
}
