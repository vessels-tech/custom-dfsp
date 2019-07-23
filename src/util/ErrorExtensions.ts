import Boom from '@hapi/boom'

import Logger from '../service/logger'
import { unsafeUnwrap, SomeResult } from './AppProviderTypes';





/**
 * unsafeUnwrapBoom
 * 
 * //TODO: figure out a better approach for this...
 * 
 */
export function unsafeUnwrapBoom<T>(result: SomeResult<T>): T {
  try {
    return unsafeUnwrap(result)
  } catch (err) {
    
    console.log("Hitting boom!", err.message)
    Logger.error(err)

    const boomError = Boom.internal(err.message, err)
    //TODO: figure out how to actually pass through the error message
    // @ts-ignore
    boomError.output.payload['message'] = err.message
    throw boomError;
  }
}
