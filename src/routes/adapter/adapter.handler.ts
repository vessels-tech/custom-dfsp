import { Context } from 'koa'

import { 
  ParticipantsResponse, 
  TransferParty, 
  IdType, 
  QuoteResponse, 
  Currency, 
  TransferResponse 
} from '../../model/InboundApiTypes'

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

  const response: TransferParty = {
    idType: IdType.MSISDN,
    idValue: "61404404404"
  }

  ctx.body = response;
}

export async function postQuoteRequests(ctx: Context) {
  //TODO: parse the quote request with a fixed rate...

  //Temp mock response
  const response: QuoteResponse = {
    quoteId: '0000-0000-0000-0000',
    transactionId: '0000-0000-0000-0000',
    transferAmount: '100.00',
    transferAmountCurrency: Currency.AUD,
    //TODO: other fields?
  }

  ctx.body = response
}

export async function postTransfers(ctx: Context) {

  const response: TransferResponse = {
    homeTransactionId: '0000-0000-0000-0000',
  }
  ctx.body = response
}
