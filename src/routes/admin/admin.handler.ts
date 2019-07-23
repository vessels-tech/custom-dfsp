import { Context } from 'koa'

import { getAllAccounts } from '../../queries/account'

export async function getAccounts(ctx: Context) {
  const accounts = await getAllAccounts()

  ctx.body = {
    status: 'success',
    data: accounts
  };
}


