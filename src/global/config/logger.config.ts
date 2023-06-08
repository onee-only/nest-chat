import * as winston from 'winston';
import { utilities, WinstonModuleOptions } from 'nest-winston';

export const LoggerConfig: WinstonModuleOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                utilities.format.nestLike('APP', {
                    colors: true,
                    prettyPrint: true,
                }),
            ),
        }),
    ],
};
