import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerConfig, SwaggerConfig } from './global/config';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(LoggerConfig),
    });

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
}
bootstrap();
