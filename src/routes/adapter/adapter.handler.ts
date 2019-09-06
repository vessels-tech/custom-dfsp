import { Context } from 'koa'

import { 
  ParticipantsResponse, 
  TransferParty, 
  QuoteResponse, 
  TransferResponse 
} from '../../model/InboundApiTypes'
import AccountStore from '../../service/AccountStore';
import SimplePositionStore from '../../service/SimplePositionStore';
import { httpUnwrap } from '../../util/AppProviderTypes';
import SimpleTransactionLog from '../../service/SimpleTransactionLog';

export async function getParticipants(ctx: Context) {
  
  //TODO: move validation logic elsewhere
  /*
    - check that idType is in IdType enum
    - check that accountId is a string with a min length 1, max length 128
  */

  //Temp mock response
  const response: ParticipantsResponse = {
    fspId: 'glasper'
  }

  ctx.body = response
}

export async function getParties(ctx: Context) {
  const { idValue } = ctx.params;
  const accountStore: AccountStore = ctx.state.accountStore;

  const account = httpUnwrap(await  accountStore.getAccount(idValue))

  const response: TransferParty = {
    idType: account.idType,
    idValue: account.idValue,
    displayName: account.name,
  }

  ctx.body = response;
  ctx.status = 200
}

export async function postQuoteRequests(ctx: Context) {
  const {
    quoteId,
    transactionId,
    amount,
    currency,
  } = ctx.request.body

  const response: QuoteResponse = {
    quoteId,
    transactionId,
    transferAmount: amount,
    transferAmountCurrency: currency
  }
  
  ctx.body = response
}

export async function postTransfers(ctx: Context) {
  const accountStore: AccountStore = ctx.state.accountStore;
  const positionStore: SimplePositionStore = ctx.state.positionStore;
  const txLog: SimpleTransactionLog = ctx.state.txLog;

  const { transferId, to: { idValue }, amount } = ctx.request.body

  const amountNum = parseFloat(amount)

  /* Add funds to the user's account */
  httpUnwrap(await accountStore.addFundsToAccount(idValue, amountNum))

  /* Increment the position (other dfsp owes us now!)*/
  positionStore.changePosition(amountNum)

  /* Save the tx to the tx Log */
  txLog.appendTransaction(ctx.request.body)

  const response: TransferResponse = {
    //I'm not sure if this is correct, but it's ok for now
    homeTransactionId: transferId,
  }
  ctx.body = response
  ctx.status = 200
}
