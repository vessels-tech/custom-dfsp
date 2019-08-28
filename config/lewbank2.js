const config = {
  "HOSTNAME": "http://localhost",
  "PORT": 4102,
  "DFSP_ID": "lewbank2",
  // "DFSP_ID": "mojaloop-sdk",
  // "PEER_ENDPOINT": "localhost:3000",
  // "PEER_ENDPOINT": "ml-api-adapter.moja-box.vessels.tech", //For talking to switch
  "PEER_ENDPOINT": "lewbank1_scheme-adapter_1:4000",
  "SCHEME_ADAPTER_ENDPOINT": "lewbank2_scheme-adapter_1:4101", //remember: this is internal to docker
  "TLS": {
    "mutualTLS": {
      "enabled": false
    }
  },
  "JWS_SIGN": false,
  "JWS_SIGNING_KEY_PATH": "secrets/jwsSigningKey.key"
}

module.exports = config;