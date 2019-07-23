import winston, { LoggerOptions, transports } from "winston";


const level = process.env.LOG_LEVEL;

// const formatter = (options: any): any => options.meta && options.meta.requestId ?
//   `[RQID=${options.meta.requestId}] ${options.message}` :
//   `${options.message}`;

const options: LoggerOptions = {
  level, //TODO: configure with env.LOG_LEVEL
  format: winston.format.simple(), //TODO: configure based on local or prod
  transports: [
    new transports.Console({
      level
    })
  ]
}
const Logger = winston.createLogger(options)

export default Logger
