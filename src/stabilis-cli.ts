import { NestFactory } from '@nestjs/core';
import { parse } from 'ts-command-line-args';

import { BASE_SOURCE_PATH, FOLDER_GRIDS, FOLDER_IMAGES } from './config';
import { InstrumentaController } from './stabilis/instrumenta/application/controllers/instrumenta.controller';
import { InstrumentaModule } from './stabilis/instrumenta/instrumenta.module';

interface CliArguments {
  sourcePath?: string;
  type?: string;
  help?: boolean;
}

async function bootstrap() {
  const args = parse<CliArguments>(
    {
      sourcePath: { type: String, optional: true },
      type: { type: String, optional: true },
      help: {
        type: Boolean,
        optional: true,
        alias: 'h',
        description: 'Prints this usage guide',
      },
    },
    {
      helpArg: 'help',
    },
  );

  const app = await NestFactory.createApplicationContext(InstrumentaModule);
  const controller = app.get(InstrumentaController);
  const path =
    args.type === 'grid'
      ? `${BASE_SOURCE_PATH}${FOLDER_GRIDS}`
      : `${BASE_SOURCE_PATH}${FOLDER_IMAGES}`;

  const files = controller.getPngFiles(path);
  if (args.type === 'grid') {
    controller.organizeGrids(path, files);
  } else {
    controller.organizeOutputs(path, files);
  }

  await app.close();
}

void bootstrap();
