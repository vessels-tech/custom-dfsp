import rc from 'rc'
const fs = require('fs')
const configFile = require(`${__dirname}/../../config/${process.env.CONFIG_FILENAME}`)

/* Override variables by setting env vars with the prefix DFSP_ */
const PREFIX = "DFSP"

const RC = rc(PREFIX, configFile)
const JWS_SIGNING_KEY = fs.readFileSync(`${__dirname}/../../${RC.JWS_SIGNING_KEY_PATH}`)

const Config = {
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT,
  DFSP_ID: RC.DFSP_ID,
  CURRENCY: RC.CURRENCY,
  PEER_ENDPOINT: RC.PEER_ENDPOINT,
  SCHEME_ADAPTER_ENDPOINT: RC.SCHEME_ADAPTER_ENDPOINT,
  TLS: RC.TLS,
  JWS_SIGN: RC.JWS_SIGN,
  JWS_SIGNING_KEY,
  SEED_USERS: RC.SEED_USERS,
  INITIAL_POSITION: RC.INITIAL_POSITION,
}

export default Config;

