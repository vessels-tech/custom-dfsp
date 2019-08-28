import { Context } from 'koa'
import AccountStore from '../../service/AccountStore';
import { unsafeUnwrap, ResultType } from '../../util/AppProviderTypes';

export async function getAccounts(ctx: Context) {
  const accountStore: AccountStore = ctx.state.accountStore;
  const accounts = unsafeUnwrap(accountStore.getAccounts())

  ctx.body = {
    statusCode: 200,
    data: accounts
  };
}

//Add funds to users account
export async function cashIn(ctx: Context) {
  const { idValue } = ctx.params;
  const { amount } = ctx.request.body;
  const accountStore: AccountStore = ctx.state.accountStore;

  const addFundsResult = accountStore.addFundsToAccount(idValue, amount)
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
export async function getPosition(ctx: Context) {

  ctx.body = { status: 200 }
}
