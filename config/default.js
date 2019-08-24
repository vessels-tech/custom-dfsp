const config = {
  "HOSTNAME": "http://localhost",
  "PORT": 4999,
  "DFSP_ID": "LewBank1",
  // "PEER_ENDPOINT": "localhost:3000",
  "PEER_ENDPOINT": "ml-api-adapter.moja-box.vessels.tech",
  "TLS": {
    "mutualTLS": {
      "enabled": false
    }
  },
  "JWS_SIGN": false,
  "JWS_SIGNING_KEY_PATH": "secrets/jwsSigningKey.key"
}

module.exports = config;