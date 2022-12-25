import { Module } from '@nestjs/common';

import { InstrumentaController } from './application/controllers/instrumenta.controller';
import { PngFilesProvider } from './application/interfaces/png-files.provider';
import { InstrumentaService } from './application/services/instrumenta.service';
import { MetadataExtractor } from './domain/parsers/metadata.extractor';
import { MetadataParser } from './domain/parsers/metadata.parser';
import { HddPngFilesProvider } from './infrastructure/storage/hdd-png-files.provider';

@Module({
  imports: [],
  controllers: [InstrumentaController],
  providers: [
    InstrumentaService,
    {
      provide: PngFilesProvider,
      useClass: HddPngFilesProvider,
    },
    MetadataParser,
    MetadataExtractor,
    InstrumentaService,
  ],
})
export class InstrumentaModule {}
