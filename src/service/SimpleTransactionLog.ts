import { Db } from 'mongodb';
import { TransferRequest } from '../model/InboundApiTypes';
import { SomeResult, makeSuccess, ResultType } from '../util/AppProviderTypes';

const TransactionCollection = 'transactionCollection';

/**
 * @class SimpleTransactionLog
 * @description
 *  A super simple example of keeping track of the list of inbound and 
 *  outbound transactions for a dfsp.
 * 
 *  This is a super sub-optimal use of mongodb, but in the future we would get
 *  rid of MongoDB anyway
 */

export default class SimpleTransactionLog {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async appendTransaction(transaction: TransferRequest): Promise<SomeResult<void>> {
    const txCol = this.db.collection(TransactionCollection)
    const txsResult = await this.getTransactionList()

    if (txsResult.type === ResultType.ERROR) {
      return txsResult;
    }

    const txList = txsResult.result;
    txList.push(transaction);
    await txCol.update({ _id: 'transactions' }, { _id: 'transactions', value: txList });

    return makeSuccess(undefined)
  }

  async getTransactionList(): Promise<SomeResult<Array<TransferRequest>>> {
    const txCol = this.db.collection(TransactionCollection)

    try {
      const txs = await txCol.findOne({ _id: 'transactions ' });

      return txs.value;
    } catch (err) {
      //Lazy init of mongo db
      await txCol.insertOne({ _id: 'transactions', value: [] })

      return makeSuccess([])
    }
  }
}