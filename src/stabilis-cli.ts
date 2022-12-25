import { NestFactory } from '@nestjs/core';

import { SOURCE_PATH } from './config';
import { InstrumentaController } from './stabilis/instrumenta/application/controllers/instrumenta.controller';
import { InstrumentaModule } from './stabilis/instrumenta/instrumenta.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(InstrumentaModule);
  const controller = app.get(InstrumentaController);
  const files = controller.getPngFiles(SOURCE_PATH);

  const output = controller.extractSeeds(SOURCE_PATH, files);
  console.log(output);

  await app.close();
}

void bootstrap();
