import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerConfig, SwaggerConfig } from './global/config';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(LoggerConfig),
    });

    // validation pipe
    app.useGlobalPipes(new ValidationPipe());

    SwaggerModule.setup(
        'api',
        app,
        SwaggerModule.createDocument(app, SwaggerConfig),
    );

    await app.listen(3000);
}
bootstrap();
