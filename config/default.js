const config = {
  HOSTNAME: "http://localhost",
  PORT: 4002,
  DFSP_ID: "lewbank1",
  CURRENCY: "AUD",

  // "DFSP_ID": "mojaloop-sdk",
  // "PEER_ENDPOINT": "localhost:3000",
  // "PEER_ENDPOINT": "ml-api-adapter.moja-box.vessels.tech",

  // TODO: Set to testing toolkit
  // PEER_ENDPOINT: "lewbank2_scheme-adapter_1:4100",
  PEER_ENDPOINT: "localhost:5000",
  SCHEME_ADAPTER_ENDPOINT: "lewbank1_scheme-adapter_1:4000",
  "TLS": {
    "mutualTLS": {
      "enabled": false
    }
  },
  "JWS_SIGN": false,
  "JWS_SIGNING_KEY_PATH": "secrets/jwsSigningKey.key",
  SEED_USERS: [
    {
      "idType": "MSISDN",
      "idValue": "123456789",
      "name": "Lewis",
      "funds": 500
    }
  ],
  INITIAL_POSITION: 10000,
  // MONGO_URL: 'mongodb://lewbank1_mongodb_1:27017/lewbank1'
  MONGO_URL: 'mongodb://localhost:27017/lewbank1'
}

module.exports = config;