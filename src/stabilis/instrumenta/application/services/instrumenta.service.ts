import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { TARGET_PATH } from '../../../../config';
import { PromptToCategoryMapper } from '../../domain/mappers/prompt-to-category.mapper';
import { MetadataExtractor } from '../../domain/parsers/metadata.extractor';
import { MetadataParser } from '../../domain/parsers/metadata.parser';
import { PngMetadata } from '../../domain/value-objects/png-metadata';
import { PngFilesProvider } from '../interfaces/png-files.provider';

export const PNG_TEXT_KEYWORD = 'parameters';

@Injectable()
export class InstrumentaService {
  constructor(
    private readonly fileProvider: PngFilesProvider,
    private readonly parser: MetadataParser,
    private readonly extractor: MetadataExtractor,
  ) {}

  public getPngTextMetadata(file: string): PngMetadata {
    const data = this.fileProvider.getPngFileContent(file);

    return this.extractor.getPngMetadata(data, file);
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
    let metadata;
    try {
      metadata = this.getPngTextMetadata(file);
    } catch (_e) {
      console.log(`Error for file: ${file}, skipping!`);
      return;
    }

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
