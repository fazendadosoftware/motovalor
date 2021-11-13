import pino from 'pino'

const logger = pino({ browser: { asObject: true } })
export interface Logger extends pino.Logger {}

export interface IUseLogger {
  logger: Logger
}

const useLogger = (): IUseLogger => ({
  logger
})

export default useLogger
