import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerConfig, SwaggerConfig } from './global/config';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(LoggerConfig),
    });

    SwaggerModule.setup(
        'api',
        app,
        SwaggerModule.createDocument(app, SwaggerConfig),
    );

    await app.listen(3000);
}
bootstrap();
