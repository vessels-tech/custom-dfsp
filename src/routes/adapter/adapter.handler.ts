import { Context } from 'koa'

import { 
  ParticipantsResponse, 
  TransferParty, 
  // IdType, 
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
  const { idType, idValue } = ctx.params;

  //For now this just mocks out and 'pretends' to have any party that it is asked for.
  const response: TransferParty = {
    idType,
    idValue,
  }

  ctx.body = response;
}

export async function postQuoteRequests(ctx: Context) {
  //TODO: this is where we got up to! we need to do *something* with the quoteRequest we get back from the scheme adapter


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
