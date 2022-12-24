import { Injectable } from '@nestjs/common';
import * as text from 'png-chunk-text';
import * as extractChunks from 'png-chunks-extract';
import { v4 } from 'uuid';

import { PromptToCategoryMapper } from '../../domain/mappers/prompt-to-category.mapper';
import { MetadataParser } from '../../domain/parsers/metadata.parser';
import { Metadata, PngMetadata } from '../../domain/value-objects/png-metadata';
import { PngFilesProvider } from '../interfaces/png-files.provider';

export const PNG_TEXT_KEYWORD = 'parameters';

// grids vs images
export const SOURCE_PATH =
  'C:/Development/StableDiffusion/stable-diffusion-webui/outputs/txt2img-images/';
// export const SOURCE_PATH =
//   'C:/Development/StableDiffusion/stable-diffusion-webui/outputs/txt2img-images/';
// export const SOURCE_PATH = 'H:/MachineLearning/ToSort/img2img/';
const TARGET_PATH = `${SOURCE_PATH}sorted/`;

@Injectable()
export class InstrumentaService {
  constructor(
    private readonly fileProvider: PngFilesProvider,
    private readonly parser: MetadataParser,
  ) {}

  public getPngTextMetadata(file: string): PngMetadata {
    const data = this.fileProvider.getPngFileContent(file);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const metadata = extractChunks(data) as Metadata[];
    const tEXtMetadata = metadata.filter((e) => e.name === 'tEXt');
    if (!tEXtMetadata.length) {
      throw new Error(`tEXt metadata not found for file ${file}`);
    }

    const buffer: Buffer = tEXtMetadata[0].data as Buffer;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return text.decode(buffer);
  }

  public organizeGrid(file: string): void {
    const metadata = this.getPngTextMetadata(file);
    const parsedData = this.parser.parseMetadata(metadata);

    const newFileName = `${
      parsedData.model
    } - ${PromptToCategoryMapper.classify(parsedData.prompt)}`;

    let suffix = '';
    if (this.fileProvider.fileExists(`${TARGET_PATH}${newFileName}.png`)) {
      suffix = ` (${v4().slice(0, 4)})`;
    }

    const fullFilePath = `${TARGET_PATH}${newFileName}${suffix}`;

    this.fileProvider.copyFile(file, fullFilePath, newFileName);
    this.fileProvider.createFile(
      fullFilePath,
      JSON.stringify(parsedData, null, 2),
      newFileName,
      file,
    );
  }

  public organizeOutput(file: string): void {
    const metadata = this.getPngTextMetadata(file);
    const parsedData = this.parser.parseMetadata(metadata);

    let name = 'unknown';
    if (parsedData.model.startsWith('model_')) {
      name = parsedData.model.split('_')[1];
    }

    if (!/^[a-zA-Z]+$/.test(name)) {
      console.log(`Name '${name}' contains non letter`);
      return;
    }

    const folderSuffix = PromptToCategoryMapper.isNaked(parsedData.prompt)
      ? '/naked/'
      : '/normal/';

    this.fileProvider.moveFile(file, `${TARGET_PATH}${name}${folderSuffix}`);
  }

  public extractSeed(file: string): number {
    const metadata = this.getPngTextMetadata(file);
    const parsedData = this.parser.parseMetadata(metadata);

    return parsedData.seed;
  }
}
