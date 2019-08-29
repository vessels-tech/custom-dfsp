import {
  Account
} from '../model/Account'
import {
  SomeResult, makeError, makeSuccess, ResultType,
} from '../util/AppProviderTypes'
import Config from './config';
import { Db } from 'mongodb';


const AccountCollection = 'accountCollection'

export type AccountStoreType = {
  [index: string]: Account
}



export default class AccountStore {
  store: AccountStoreType = {}
  db: Db;

  constructor(db: Db) {
    //Add users from seed?
    Config.SEED_USERS.forEach((account: Account) => this.store[account.idValue] = account)
    
    this.db = db
  }

  
  async addAccount(account: Account): Promise<void> {
    const accounts = await this._mongoGetAccounts();

    //Note: if the same idValue is used with a different ID type, the account will be overriden
    accounts[account.idValue] = account;
    await this._mongoSaveAccounts(accounts)
  }

  async getAccount(idValue: string): Promise<SomeResult<Account>> {
    const accounts = await this._mongoGetAccounts();

    if (!accounts[idValue]) {
      return makeError(`Account not found for idValue: ${idValue}`, 404)
    }
    
    const account = accounts[idValue]
    return makeSuccess<Account>(account)
  }

  async getAccounts(): Promise<SomeResult<Array<Account>>> {
    const accounts = await this._mongoGetAccounts();
    const accountList = Object.keys(accounts).map(k => accounts[k])

    return makeSuccess(accountList)
  }

  async addFundsToAccount(idValue: string, amount: number): Promise<SomeResult<any>> {
    if (amount <= 0) {
      return makeError('addFundsToAccount amount must be greater than 0', 400)
    } 

    return this._modifyAccountFunds(idValue, amount)
  }

 async deductFundsFromAccount(idValue: string, amount: number): Promise<SomeResult<any>> {
    if (amount >= 0) {
      return makeError('deductFundsFromAccount, amount must be less than 0', 400)
    } 

    return this._modifyAccountFunds(idValue, amount)
  }

  /*
   * These are some lazy uses of mongo, but we just want to get basic state working 
   */
  async _mongoGetAccounts(): Promise<AccountStoreType> {
    const accountCol = this.db.collection(AccountCollection)
    try {
      const accounts = await accountCol.findOne({ _id: 'accounts' })
      return accounts.value;
    } catch (err) {
      //Lazily init the accounts, as we can't do it in the constructor
      await accountCol.insertOne({ _id: 'accounts', value: {} })
      return {}
    }
  }

  async _mongoSaveAccounts(accounts: AccountStoreType): Promise<void> {
    const accountCol = this.db.collection(AccountCollection)
    await accountCol.update({ _id: 'accounts' }, { _id: 'accounts', value: accounts})
  }

  async _modifyAccountFunds(idValue: string, delta: number): Promise<SomeResult<any>> {
    const getAccountResult = await this.getAccount(idValue)
    if (getAccountResult.type === ResultType.ERROR) {
      return getAccountResult
    }

    const account = getAccountResult.result;
    account.funds += delta

    this.addAccount(account)
    return makeSuccess(undefined)
  }

}