import { Context } from 'koa'
import AccountStore from '../../service/AccountStore';
import { unsafeUnwrap } from '../../util/AppProviderTypes';

export async function getAccounts(ctx: Context) {
  const accountStore: AccountStore = ctx.state.accountStore;

  const accounts = unsafeUnwrap(accountStore.getAccounts())

  ctx.body = {
    status: 'success',
    data: accounts
  };
}

//Add funds to users account
export async function cashIn(ctx: Context) {

  ctx.body = { status: 200 }
}

//Get the position of this dfsp. Not sure how this works without a central switch
export async function getPosition(ctx: Context) {

  ctx.body = { status: 200 }
}
