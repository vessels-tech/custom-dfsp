
import Logger from '../service/logger';
import { SomeResult, makeSuccess, makeError } from '../util/AppProviderTypes'
import {
  AccountModel,
  getAccountForUser
} from '../queries/account'


/**
 * This is where we map the AccountModel from the db domain, to our business domain
 */

export type Account = {
  username: string,
  accessToken: string
}

//TODO: is there a way to do this with generators?
function accountModelToAccount(input: AccountModel): Account {
  return {
    username: input.username,
    accessToken: input.access_token,
  }
}

export async function accountForUser(username: string): Promise<SomeResult<Account>> {
  try {
    const accountModel = await getAccountForUser(username)
    if (!accountModel) {
      throw new Error(`No account found for username: ${username}`)
    }

    const account = accountModelToAccount(accountModel)
    return makeSuccess(account)
  } catch (err) {
    Logger.error(err);
    return makeError(err.message)
  }

}