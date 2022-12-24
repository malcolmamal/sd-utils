import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { PngParsedMetadata } from '../dto/png-parsed-metadata.dto';
import { PngMetadata } from '../value-objects/png-metadata';

const UNKNOWN_MODEL = 'UNKNOWN_MODEL';

export class MetadataParser {
  private parseValue(value: string, tokenKey: string): string | number {
    switch (tokenKey) {
      case 'steps':
      case 'seed':
        return parseInt(value);
      case 'cfgScale':
      case 'denoisingStrength':
        return parseFloat(value);
      default:
        return value;
    }
  }

  public parseMetadata(metadata: PngMetadata): PngParsedMetadata {
    const textValue = metadata.text;

    const tokensMap = new Map<string, string>();
    tokensMap.set('Model', 'model');
    tokensMap.set('Model hash', 'modelHash');
    tokensMap.set('Size', 'size');
    tokensMap.set('Seed', 'seed');
    tokensMap.set('CFG scale', 'cfgScale');
    tokensMap.set('Sampler', 'sampler');
    tokensMap.set('Steps', 'steps');
    tokensMap.set('Negative prompt', 'negativePrompt');
    tokensMap.set('Prompt', 'prompt');
    tokensMap.set('Denoising strength', 'denoisingStrength');
    tokensMap.set('First pass size', 'firstPassSize');

    const mainToken = 'Steps:';
    const negativeToken = 'Negative prompt: ';

    const mainTokenPosition = textValue.indexOf(mainToken);
    const promptsPart = textValue.slice(0, mainTokenPosition - 1);
    const tokensPart = textValue.slice(mainTokenPosition);

    const negativeTokenPosition = textValue.indexOf(negativeToken);

    const parsed = this.parseText(tokensPart);

    if (negativeTokenPosition !== -1) {
      const parts = promptsPart.split(negativeToken);
      parsed.set('Prompt', parts[0].trim());
      parsed.set('Negative prompt', parts[1].trim());
    } else {
      parsed.set('Prompt', promptsPart.trim());
    }

    if (!parsed.has('Model')) {
      parsed.set('Model', UNKNOWN_MODEL);
    }

    const object = {};
    parsed.forEach((value, key) => {
      const tokenKey = tokensMap.get(key);
      if (tokenKey) {
        object[tokenKey] = this.parseValue(value, tokenKey);
      }
    });

    const parsedMetadata = plainToInstance(PngParsedMetadata, object);
    const validationError = validateSync(parsedMetadata);

    if (validationError.length > 0) {
      throw new Error(
        `Validation failed for ${JSON.stringify(
          metadata,
        )} with error ${validationError}`,
      );
    }

    return parsedMetadata;
  }

  private parseText(textValue: string): Map<string, string> {
    const map = new Map<string, string>();
    const pairs = textValue.split(', ');

    for (const pair of pairs) {
      const [key, value] = pair.split(': ', 2);
      map.set(key, value);
    }

    return map;
  }
}
