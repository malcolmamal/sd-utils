import { Controller, Get } from '@nestjs/common';

import { PngParsedMetadata } from '../../domain/dto/png-parsed-metadata.dto';
import { MetadataParser } from '../../domain/parsers/metadata.parser';
import { PngMetadata } from '../../domain/value-objects/png-metadata';
import { PngFilesProvider } from '../interfaces/png-files.provider';
import { InstrumentaService } from '../services/instrumenta.service';

@Controller()
export class InstrumentaController {
  constructor(
    private readonly service: InstrumentaService,
    private readonly filesProvider: PngFilesProvider,
    private readonly parser: MetadataParser,
  ) {}

  @Get()
  getPngTextMetadata(file: string): PngMetadata {
    return this.service.getPngTextMetadata(file);
  }

  @Get()
  getParsedPngMetadata(metadata: PngMetadata): PngParsedMetadata {
    return this.parser.parseMetadata(metadata);
  }

  @Get()
  organizeGrids(path: string, files: string[]): string {
    files.forEach((file) => {
      this.service.organizeGrid(path + file);
    });

    return 'done';
  }

  @Get()
  organizeOutputs(path: string, files: string[]): string {
    files.forEach((file) => {
      this.service.organizeOutput(path + file);
    });

    return 'done';
  }

  @Get()
  extractSeeds(path: string, files: string[]): string {
    const seeds: number[] = [];
    files.forEach((file) => {
      seeds.push(this.service.extractSeed(path + file));
    });

    return seeds.join(',');
  }

  @Get()
  getPngFiles(path: string): string[] {
    return this.filesProvider.getPngFiles(path);
  }
}
