
import Logger from '../service/logger';
import { SomeResult, makeSuccess, makeError } from '../util/AppProviderTypes'
import {
  AccountModel,
  getAccountForUser
} from '../queries/account'
import { Credential, credentialModelToCredential } from './Credential'
import { getCredentialsForUser } from '../queries/credential';


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


/**
 * @function credentialsForUser
 * @description Get the saved credentials for the user
 * 
 */
export async function credentialsForUser(username: string): Promise<SomeResult<Credential[]>> {
  try {
    const credentialModels = await getCredentialsForUser(username)
    if (!credentialModels) {
      throw new Error(`No credentials found for username: ${username}`)
    }

    console.log('credentialModels', credentialModels)

    const credentials = credentialModels.map(i => credentialModelToCredential(i))
    return makeSuccess(credentials)
  } catch (err) {
    Logger.error(err);
    return makeError(err.message)
  }
}