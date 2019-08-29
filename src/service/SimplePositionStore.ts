import { Db } from 'mongodb';


const PositionCollection = 'positionCollection'

//TODO: persist state somewhere

/**
 * @class SimplePositionStore
 * @description 
 *  A super simple example of keeping track of position for a peer-peer mojaloop
 *  environment.
 */
export default class SimplePositionStore {
  initialPosition: number
  db: Db

  constructor(db: Db, initialPosition: number) {
    this.initialPosition = initialPosition;
    this.db = db;
  }

  async getPosition(): Promise<number> {
    const positionCol = this.db.collection(PositionCollection)
    try {
      const position = await positionCol.findOne({_id: 'position'})
      return position.value
    } catch (err) {
      //Lazily init the position, as we can't do it in the constructor
      await positionCol.insertOne({ _id: 'position', value: this.initialPosition})

      return this.initialPosition
    }
  }

  async changePosition(delta: number): Promise<void> {
    const positionCol = this.db.collection(PositionCollection)

    let value = await this.getPosition();
    value += delta
    await positionCol.update({ _id: 'position' }, {_id:'position', value})
  }

}