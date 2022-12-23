import { Controller, Get } from '@nestjs/common';
import { AppService, PngMetadata, PngParsedMetadata } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPngTextMetadata(file: string): PngMetadata {
    return this.appService.getPngTextMetadata(file);
  }

  @Get()
  getParsedPngMetadata(metadata: PngMetadata): PngParsedMetadata {
    return this.appService.parseMetadata(metadata);
  }

  @Get()
  organizeGrids(path: string, files: string[]): string {
    files.forEach(async (file) => {
      this.appService.organizeGrid(path + file);
    });

    return 'done';
  }

  @Get()
  organizeOutputs(path: string, files: string[]): string {
    files.forEach(async (file) => {
      this.appService.organizeOutput(path + file);
    });

    return 'done';
  }

  @Get()
  extractSeeds(path: string, files: string[]): string {
    const seeds: number[] = [];
    files.forEach(async (file) => {
      seeds.push(this.appService.extractSeed(path + file));
    });

    return seeds.join(',');
  }

  @Get()
  getPngFiles(path: string): string[] {
    return this.appService.getPngFiles(path);
  }
}
