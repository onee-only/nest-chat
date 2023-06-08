import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerConfig } from './global/config';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(LoggerConfig),
    });
    await app.listen(3000);
}
bootstrap();
