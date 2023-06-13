import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
    .setTitle('Chat app')
    .setDescription('Chat app created by onee-only')
    .setVersion('1.0.0')
    .addTag('api')
    .build();
