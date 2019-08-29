import { Db } from 'mongodb';



//TODO: persist state somewhere

/**
 * @class SimplePositionStore
 * @description 
 *  A super simple example of keeping track of position for a peer-peer mojaloop
 *  environment.
 */
export default class SimplePositionStore {
  position: number
  db: Db

  constructor(db: Db, initialPosition: number) {
    this.position = initialPosition;
    this.db = db;
  }

  getPosition() {
    return this.position
  }

  changePosition(delta: number) {
    this.position += delta
  }

}