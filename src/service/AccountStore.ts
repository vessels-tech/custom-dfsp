import {
  Account
} from '../model/Account'
import {
  SomeResult, makeError, makeSuccess, ResultType,
} from '../util/AppProviderTypes'
import Config from './config';


export type AccountStoreType = {
  [index: string]: Account
}


//TODO: persist state somewhere

export default class AccountStore {
  store: AccountStoreType = {}

  constructor() {
    //Add users from seed
    Config.SEED_USERS.forEach((account: Account) => this.store[account.idValue] = account)
  }

  
  addAccount(account: Account): void {
    //Note: if the same idValue is used with a different ID type, the account will be overriden
    this.store[account.idValue] = account;
  }

  getAccount(idValue: string): SomeResult<Account> {
    if (!this.store[idValue]) {
      return makeError(`Account not found for idValue: ${idValue}`, 404)
    }
    
    const account = this.store[idValue]
    return makeSuccess<Account>(account)
  }

  getAccounts(): SomeResult<Array<Account>> {
    const accounts = Object.keys(this.store).map(k => this.store[k])
    return makeSuccess(accounts)
  }

  addFundsToAccount(idValue: string, amount: number): SomeResult<any> {
    if (amount <= 0) {
      return makeError('addFundsToAccount amount must be greater than 0', 400)
    } 

    return this._modifyAccountFunds(idValue, amount)
  }

  deductFundsFromAccount(idValue: string, amount: number): SomeResult<any> {
    if (amount >= 0) {
      return makeError('deductFundsFromAccount, amount must be less than 0', 400)
    } 

    return this._modifyAccountFunds(idValue, amount)
  }

  _modifyAccountFunds(idValue: string, delta: number): SomeResult<any> {
    const getAccountResult = this.getAccount(idValue)
    if (getAccountResult.type === ResultType.ERROR) {
      return getAccountResult
    }

    const account = getAccountResult.result;
    account.funds += delta

    this.addAccount(account)
    return makeSuccess(undefined)
  }

}