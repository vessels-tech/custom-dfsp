


//TODO: persist state somewhere

/**
 * @class SimplePositionStore
 * @description 
 *  A super simple example of keeping track of position for a peer-peer mojaloop
 *  environment.
 */
export default class SimplePositionStore {
  position: number

  constructor(initialPosition: number) {
    this.position = initialPosition
  }

  getPosition() {
    return this.position
  }

  changePosition(delta: number) {
    this.position += delta
  }

}