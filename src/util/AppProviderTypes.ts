
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status

    return this;
  }

  getStatus() {
    return this.status
  }

  getBody() {
    return {
      statusCode: this.status,
      error: this.message, //Todo change to custom error that matches code
      message: this.message,
    }
  }
}


export type SomeResult<T> = ErrorResult | SuccessResult<T>;

export type SuccessResult<T> = {
  result: T,
  type: ResultType.SUCCESS,
}

export type ErrorResult = {
  message: string,
  errorCode: number, //For now, just use http status codes. Eventually use proper codes
  type: ResultType.ERROR,
}

export enum ResultType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export function makeSuccess<T>(result: T): SomeResult<T> {
  return {
    type: ResultType.SUCCESS,
    result,
  };
}

export function makeError<T>(message: string, errorCode: number = 500): SomeResult<T> {
  return {
    type: ResultType.ERROR,
    errorCode,
    message,
  };
}

export function isError(result: SomeResult<any>) {
  if (result.type === ResultType.ERROR) {
    return true;
  }

  return false;
}


/**
 * unsafeUnwrap
 * 
 * Unwrap a result unsafelty. Similar to Rust
 * Throws error if result.type === ResultError
 */
export function unsafeUnwrap<T>(result: SomeResult<T>): T {
  if (result.type === ResultType.ERROR) {
    console.log("UNSAFELY UNWRAPPING STUFF!", result.message)
    throw new Error(result.message);
  }

  return result.result;
}


/**
 * http unwrap
 * 
 * Unwrap a result and handle Koa error
 */
export function httpUnwrap<T>(result: SomeResult<T>): T {
  if (result.type === ResultType.ERROR) {
    throw new HttpError(result.errorCode, result.message)
  }

  return result.result;
}


/**
 * Reduces a list of SomeResults and returns if any of them contain an error
 */
export function resultsHasError(results: Array<SomeResult<any>>): boolean {
  return results.reduce((acc: any, curr: any) => {
    if (curr.type === ResultType.ERROR) {
      return true;
    }
    return acc;
  }, false);
}

/**
 * Reduces a list of SomeResults to a single result.
 * Final result must have a type of void.
 */
export function summarizeResults(results: Array<SomeResult<any>>): SomeResult<void> {
  let errorMessage = '';
  results.forEach(r => {
    if (r.type === ResultType.ERROR) {
      errorMessage += `, ${r.message}`;
    }
  });

  if (errorMessage !== '') {
    return makeError<void>(errorMessage)
  }

  return makeSuccess(undefined);
}