import rc from 'rc'
const fs = require('fs')
const configFile = require('../../config/default.js')

/* Override variables by setting env vars with the prefix DFSP_ */
const PREFIX = "DFSP"

const RC = rc(PREFIX, configFile)
const JWS_SIGNING_KEY = fs.readFileSync(`${__dirname}/../../${RC.JWS_SIGNING_KEY_PATH}`)

const Config = {
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT,
  DFSP_ID: RC.DFSP_ID,
  PEER_ENDPOINT: RC.PEER_ENDPOINT,
  TLS: RC.TLS,
  JWS_SIGN: RC.JWS_SIGN,
  JWS_SIGNING_KEY,
}

export default Config;

