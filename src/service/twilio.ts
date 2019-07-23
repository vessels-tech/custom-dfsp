// const accountSid = 'ACab9a33b9ae9220c6d146fe793333ec35';
// const authToken = 'your_auth_token';
// const client = require('twilio')(accountSid, authToken);

import { Twilio as TwilioClient } from 'twilio'

import { makeSuccess, makeError, SomeResult } from '../util/AppProviderTypes';

// client.messages
//   .create({
//     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//     from: '+15017122661',
//     to: '+15558675310'
//   })
//   .then(message => console.log(message.sid));

class Twilio {
  client: TwilioClient;

  constructor(accountSid: string, authToken: string) {
    this.client = new TwilioClient(accountSid, authToken)
  }

  async sendMessage(from: string, to: string, message: string): Promise<SomeResult<object>> {
    return this.client.messages.create({
      body: message,
      from,
      to
    })
    .then((message: any) => makeSuccess(message))
    .catch((err: Error) => makeError(err.message))
  }
}

export default Twilio