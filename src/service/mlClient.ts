const MojaloopRequests = require('@modusbox/mojaloop-sdk-standard-components').MojaloopRequests;

import Config from './config'
// import Logger from './logger';


const mlClient = new MojaloopRequests({
  logger: {
    //TODO: replace this with proper winston log...
    log: (thing: any) => {  
      console.log("[WARN]", thing)
    }
  },
  peerEndpoint: Config.PEER_ENDPOINT,
  dfspId: Config.DFSP_ID,
  // TODO: other config?
  tls: Config.TLS,
  jwsSign: Config.JWS_SIGN,
  jwsSigningKey: Config.JWS_SIGNING_KEY,
  // wso2BearerToken: config.wso2BearerToken //leaving as undefined
});


export default mlClient