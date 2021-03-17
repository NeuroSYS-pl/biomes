import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: ['error'],
  });
  await app.get<CliModule>(CliModule).run(process.argv);
  await app.close();
}

bootstrap();
