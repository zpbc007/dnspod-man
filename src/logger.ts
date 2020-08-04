import Pino, {Logger} from 'pino'

export interface ILogConfig {
    level: string,
    prettyPrint: boolean,
    destination: string
}

export let logger: Logger

export async function create(logConfig: ILogConfig) {
    logger = Pino({
        level: logConfig.level,
        prettyPrint: logConfig.prettyPrint,
    }, Pino.destination(logConfig.destination))
}