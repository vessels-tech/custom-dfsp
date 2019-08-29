const config = {
  "HOSTNAME": "http://localhost",
  "PORT": 4002,
  "DFSP_ID": "lewbank1",
  "CURRENCY": "AUD",
  // "DFSP_ID": "mojaloop-sdk",
  // "PEER_ENDPOINT": "localhost:3000",
  // "PEER_ENDPOINT": "ml-api-adapter.moja-box.vessels.tech",
  "PEER_ENDPOINT": "lewbank2_scheme-adapter_1:4100",
  "SCHEME_ADAPTER_ENDPOINT": "lewbank1_scheme-adapter_1:4001",
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
  INITIAL_POSITION: 10000
}

module.exports = config;