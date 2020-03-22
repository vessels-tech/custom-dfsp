import { Context } from 'koa'
import AccountStore from '../../service/AccountStore';
import SimplePositionStore from '../../service/SimplePositionStore';
import { unsafeUnwrap, ResultType, httpUnwrap } from '../../util/AppProviderTypes';
import SimpleTransactionLog from '../../service/SimpleTransactionLog';
import {  RouterContext } from 'koa-router';

// export async function getAccounts(ctx: Context) {

export async function getAccounts(ctx: RouterContext) {
  const accountStore: AccountStore = ctx.state.accountStore;
  const accounts = unsafeUnwrap(await accountStore.getAccounts())

  ctx.body = {
    statusCode: 200,
    data: accounts
  };
}

//Add funds to users account
export async function cashIn(ctx: RouterContext) {
  const { idValue } = ctx.params;
  const { amount } = ctx.request.body;
  const accountStore: AccountStore = ctx.state.accountStore;

  const addFundsResult = await accountStore.addFundsToAccount(idValue, amount)
  // TODO: make more generic
  if (addFundsResult.type === ResultType.ERROR) {
    ctx.status = 404
    ctx.body = {
      statusCode: 404,
      error: "Not found",
      message: "Account not found"
    }

    return
  }

  ctx.status = 202
  ctx.body = { 
    statusCode: 202
  }
}

//Get the position of this dfsp. Not sure how this works without a central switch
export async function getPosition(ctx: RouterContext) {
  const positionStore: SimplePositionStore = ctx.state.positionStore;

  ctx.status = 200
  ctx.body = { 
    statusCode: 200,
    position: await positionStore.getPosition()
  }
}


/**
 * @function getTransactions
 * 
 * @description Get the list of transactions
 * 
 * @param ctx 
 */

export async function getTransactions(ctx: Context) {
  const txLog: SimpleTransactionLog = ctx.state.transactionLog;

  const transactions = httpUnwrap(await txLog.getTransactionList())

  ctx.status = 200
  ctx.body = {
    statusCode: 200,
    transactions: transactions
  }
}