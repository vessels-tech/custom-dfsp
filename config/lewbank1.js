const config = {
  "HOSTNAME": "http://localhost",
  "PORT": 4002,
  "DFSP_ID": "lewbank1",
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
  "JWS_SIGNING_KEY_PATH": "secrets/jwsSigningKey.key"
}

module.exports = config;