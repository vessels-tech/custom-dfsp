import rc from 'rc'
const configFile = require('../../config/default.json')

/* Override variables by setting env vars with the prefix SSS_ */
const PREFIX = "SSS"
const RC = rc(PREFIX, configFile)

const Config = {
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT,
}

export default Config;

