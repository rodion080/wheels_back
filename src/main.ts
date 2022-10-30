import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function launch() {
    const PORT = process.env.PORT || 7000;

    const app = await NestFactory.create(AppModule, { cors: true });
    const config = new DocumentBuilder()
        .setTitle("Wheel's hub backend")
        .setDescription('REST API Docs')
        .setVersion('1.0.0')
        .addTag('Rodion D.')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    await app.listen(PORT, () =>
        console.log(`Server is started on the port:${PORT}`),
    );
}

//TODO set this id in config
//TODO wrap in transactions (sync db with file upload)
//TODO Make LK on FRONT and connect it with back
//TODO read nest docs
launch();
