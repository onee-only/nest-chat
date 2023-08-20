import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerConfig, SwaggerConfig } from './global/modules/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // versioning
    app.setGlobalPrefix('v1');

    // logger
    app.useLogger(WinstonModule.createLogger(LoggerConfig));

    // validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // cookie parser
    app.use(cookieParser());

    // cors
    app.enableCors({
        origin: ['localhost:3000'],
        credentials: true,
    });

    // swagger
    const document = SwaggerModule.createDocument(app, SwaggerConfig);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    app.get(Logger).log(`Server is listening on: ${await app.getUrl()}`, 'App');
}
bootstrap();
