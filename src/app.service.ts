import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as extractChunks from 'png-chunks-extract';
import * as text from 'png-chunk-text';
import { v4 } from 'uuid';
import { Styles } from './styles';
import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, validateSync, IsOptional } from 'class-validator';
import * as path from 'path';

export const PNG_TEXT_KEYWORD = 'parameters';

export interface PngMetadata {
  keyword: string;
  text: string;
}

export class PngParsedMetadata {
  @IsString()
  prompt: string;

  @IsString()
  @IsOptional()
  negativePrompt?: string;

  @IsNumber()
  steps: number;

  @IsString()
  sampler: string;

  @IsNumber()
  cfg: number;

  @IsNumber()
  seed: number;

  @IsString()
  size: string;

  @IsString()
  modelHash: string;

  @IsString()
  model: string;
}

export const SOURCE_PATH =
  'C:/Development/StableDiffusion/stable-diffusion-webui/outputs/txt2img-grids/';
// export const SOURCE_PATH =
//   'C:/Development/StableDiffusion/stable-diffusion-webui/outputs/txt2img-images/';
// export const SOURCE_PATH = 'H:/MachineLearning/ToSort/img2img/';
const TARGET_PATH = SOURCE_PATH + `sorted/`;

@Injectable()
export class AppService {
  public getPngTextMetadata(file: string): PngMetadata {
    const data = fs.readFileSync(file);
    const metadata = extractChunks(data);
    const tEXtMetadata = metadata.filter((e) => e.name === 'tEXt');
    if (!tEXtMetadata || !tEXtMetadata.length) {
      throw new Error('tEXt metadata not found');
    }

    const buffer: Buffer = tEXtMetadata[0].data;

    return text.decode(buffer);
  }

  public parseMetadata(metadata: PngMetadata): PngParsedMetadata {
    let text = metadata.text;

    const tokens = [
      'Model: ',
      'Model hash: ',
      'Size: ',
      'Seed: ',
      'CFG scale: ',
      'Sampler: ',
      'Steps: ',
      'Negative prompt: ',
    ];

    const values = [];
    tokens.forEach((token) => {
      const pair = text.split(token);
      values.push(pair[1]);
      text = pair[0];
    });

    const parsed = plainToInstance(PngParsedMetadata, {
      prompt: text.trim(),
      negativePrompt: values[7]?.slice(0, -1),
      steps: parseInt(values[6]),
      sampler: values[5].slice(0, -2),
      cfg: parseFloat(values[4]),
      seed: parseInt(values[3]),
      size: values[2].slice(0, -2),
      modelHash: values[1].slice(0, -2),
      model: values[0],
    });

    const validationError = validateSync(parsed);

    if (validationError.length > 0) {
      throw new Error(`Validation failed for ${JSON.stringify(metadata)}`);
    }

    return parsed;
  }

  public organizeGrid(file: string): void {
    const metadata = this.getPngTextMetadata(file);
    const parsedData = this.parseMetadata(metadata);

    const newFileName = `${parsedData.model} - ${this.pickClassifiedPromptCode(
      parsedData.prompt,
    )}`;

    let suffix = '';
    if (fs.existsSync(`${TARGET_PATH}${newFileName}.png`)) {
      suffix = ` (${v4().slice(0, 4)})`;
    }

    const fullFilePath = `${TARGET_PATH}${newFileName}${suffix}`;

    fs.copyFile(file, `${fullFilePath}.png`, (err) => {
      if (err) {
        throw new Error(
          `File ${newFileName}.png was not copied to destination`,
        );
      }
    });

    fs.writeFile(
      `${fullFilePath}.json`,
      JSON.stringify(parsedData, null, 2),
      (err) => {
        if (err) {
          throw new Error(`File ${newFileName}.json was not created`);
        }
      },
    );
  }

  public organizeOutput(file: string): void {
    const metadata = this.getPngTextMetadata(file);
    const parsedData = this.parseMetadata(metadata);

    let name = 'unknown';
    if (parsedData.model.startsWith('model_')) {
      name = parsedData.model.split('_')?.[1];
    }

    if (!/^[a-zA-Z]+$/.test(name)) {
      console.log(`Name '${name}' contains non letter`);
      return;
    }

    const folderSuffix = this.isNaked(parsedData.prompt)
      ? '/naked/'
      : '/normal/';

    fs.mkdirSync(`${TARGET_PATH}${name}${folderSuffix}`, { recursive: true });

    const basename = path.basename(file);
    fs.rename(
      file,
      `${TARGET_PATH}${name}${folderSuffix}${basename}`,
      function (err) {
        if (err) throw err;
      },
    );
  }

  public getPngFiles(path: string): string[] {
    const files = fs.readdirSync(path);
    return files.filter((file) => file.endsWith('.png'));
  }

  private isNaked(prompt: string): boolean {
    return ['naked', 'nude', 'topless'].some(
      (element) => prompt.indexOf(element) !== -1,
    );
  }

  private pickClassifiedPromptCode(prompt: string): string {
    const contains = (text: string, words: string[]): boolean =>
      words.every((el) => {
        return text.match(new RegExp(el, 'i'));
      });

    const man = 'sks person';
    const woman = 'sks woman';

    const containsMan = (text: string, words: string[] = []): string => {
      return contains(text, [...words, man]) ? prompt : '';
    };
    const containsWoman = (text: string, words: string[] = []): string => {
      return contains(text, [...words, woman]) ? prompt : '';
    };

    switch (prompt) {
      case containsWoman(prompt, ['topless', 'bokeh']): {
        return Styles.WOMAN_NAKED_BOKEH;
      }
      case containsWoman(prompt, ['topless', 'pose study']): {
        return Styles.WOMAN_NAKED;
      }
      case containsWoman(prompt, [
        'topless',
        'feminine',
        'epic',
        'studio lighting',
        'hyperrealistic',
      ]): {
        return Styles.WOMAN_TOPLESS_ARTISTIC;
      }
      case containsWoman(prompt, ['topless']): {
        return Styles.WOMAN_CASUAL_NUDE;
      }
      case containsWoman(prompt, ['naked']): {
        return Styles.WOMAN_UNKNOWN_NAKED;
      }
      case containsWoman(prompt, ['nude']): {
        return Styles.WOMAN_UNKNOWN_NUDE;
      }
      case containsWoman(prompt, ['topless']): {
        return Styles.WOMAN_UNKNOWN_TOPLESS;
      }
      case containsWoman(prompt, ['1930s']): {
        return Styles.WOMAN_YEAR_1930;
      }
      case containsWoman(prompt, ['Moody', 'Lonesome', 'Hasselblad']): {
        return Styles.WOMAN_MOODY_HASELBLAD;
      }
      case containsWoman(prompt, ['peter lindbergh', 'portrait']): {
        return Styles.WOMAN_PORTRAIT_PETER_LIDBERGH;
      }
      case containsWoman(prompt, ['arctic fox spirit']): {
        return Styles.WOMAN_PAINTING_ARCTIC_SPIRIT;
      }
      case containsWoman(prompt, ['magic celestial', 'transparent']): {
        return Styles.WOMAN_PAINTING_CELESTIAL;
      }
      case containsWoman(prompt, ['mischievous', 'queen of elves']): {
        return Styles.WOMAN_PORTRAIT_QUEEN_OF_ELVES;
      }
      case containsWoman(prompt, ['masterpiece', 'jean-baptiste monge']): {
        return Styles.WOMAN_PORTRAIT_JEAN_BAPTISTE_MONGE;
      }
      case containsWoman(prompt, ['sensual', 'irezumi tattoos']): {
        return Styles.WOMAN_IREZUMI_TATTOOS;
      }
      case containsWoman(prompt, ['flat colors', 'watercolors']): {
        return Styles.WOMAN_PAINTING_WATERCOLOR;
      }
      case containsWoman(prompt, [
        'flat colors',
        'multicolored',
        'russ mills',
      ]): {
        return Styles.WOMAN_PAINTING_RUSS_MILLS;
      }
      case containsWoman(prompt, ['croptop', 'josan gonzales']): {
        return Styles.WOMAN_PORTRAIT_JOSAN_GONZALES;
      }
      case containsWoman(prompt, ['pudge', 'elegant', 'highly detailed']): {
        return Styles.WOMAN_PAINTING_ELEGANT_PUDGE;
      }
      case containsWoman(prompt, ['portrait', 'realistic', 'Jeremy Lipking']): {
        return Styles.WOMAN_PORTRAIT_JEREMY_LIPKING;
      }
      case containsWoman(prompt, [
        'feminine',
        'epic',
        'hyperrealistic',
        'pores',
      ]): {
        return Styles.WOMAN_FEMININE_SUPERHERO;
      }
      case containsWoman(prompt, ['lingerie']): {
        return Styles.WOMAN_LINGERIE;
      }
      case containsWoman(prompt, ['delirium']): {
        return Styles.WOMAN_DELIRIUM;
      }
      case containsWoman(prompt, ['female dr strange']): {
        return Styles.WOMAN_DR_STRANGE;
      }
      case containsWoman(prompt, ['dominatrix']): {
        return Styles.WOMAN_DOMINATRIX;
      }
      case containsWoman(prompt, ['leather jacket']): {
        return Styles.WOMAN_LEATHER_JACKET;
      }
      case containsWoman(prompt, ['spirograph']): {
        return Styles.WOMAN_SPIROGRAPH;
      }
      case containsWoman(prompt, ['cyberpunk', 'neon', 'reflective']): {
        return Styles.WOMAN_NEON_CYBERPUNK;
      }
      case containsWoman(prompt, ['leather', 'armor']): {
        return Styles.WOMAN_ARMOR;
      }
      case containsWoman(prompt, ['winged', 'firemancer']): {
        return Styles.WOMAN_WINGED_FIREMANCER;
      }
      case containsWoman(prompt, ['firemancer', 'fire in hands']): {
        return Styles.WOMAN_FIREMANCER;
      }
      case containsWoman(prompt, ['Agnes Cecile']): {
        return Styles.WOMAN_AGNESS_CECILE;
      }
      case containsWoman(prompt, ['Sung Choi', 'Mitchell Mohrhauser']): {
        return Styles.WOMAN_FANCY_PAINTING;
      }
      case containsWoman(prompt, ['Flora Borsi']): {
        return Styles.WOMAN_FLORA_BORSI;
      }
      case containsWoman(prompt, ['makoto shinkai', 'dreamy eyes']): {
        return Styles.WOMAN_ANIME;
      }
      case containsWoman(prompt, [
        'intricate',
        'gothic clothing',
        'victoria secret',
      ]): {
        return Styles.WOMAN_INTRICATE;
      }
      case containsWoman(prompt, ['beautiful eyes', 'fantasy art']): {
        return Styles.WOMAN_INTERESTING_PORTRAIT;
      }
      case containsWoman(prompt, ['samurai', 'katana']): {
        return Styles.WOMAN_SAMURAI;
      }
      case containsWoman(prompt, ['bokeh']): {
        return Styles.WOMAN_BOKEH;
      }
      case containsWoman(prompt, ['detailed face']): {
        return Styles.WOMAN_NORMAL;
      }
      case containsWoman(prompt): {
        return Styles.WOMAN_UNKNOWN;
      }
      case containsMan(prompt, ['masculine', 'epic', 'hyperrealistic']): {
        return Styles.MAN_MASCULINE_SUPERHERO;
      }
      case containsMan(prompt, ['handsome', 'firemancer']): {
        return Styles.MAN_FIREMANCER;
      }
      case containsMan(prompt, ['Moody', 'Lonesome', 'Hasselblad']): {
        return Styles.MAN_MOODY_HASELBLAD;
      }
      case containsMan(prompt, ['samurai', 'katana']): {
        return Styles.MAN_SAMURAI;
      }
      case containsMan(prompt, ['conan the barbarian']): {
        return Styles.MAN_BARBARIAN;
      }
      case containsMan(prompt, ['blade runner', 'cyberpunk']): {
        return Styles.MAN_CYBERPUNK_BLADE_RUNNER;
      }
      case containsMan(prompt, ['bokeh']): {
        return Styles.MAN_BOKEH;
      }
      case containsMan(prompt, ['intricate']): {
        return Styles.MAN_INTRICATE;
      }
      case containsMan(prompt, ['detailed face']): {
        return Styles.MAN_NORMAL;
      }
      case containsMan(prompt): {
        return Styles.MAN_UNKNOWN;
      }
      default:
        return `${Styles.UNKNOWN} - ${v4().slice(0, 8)}`;
    }
  }
}
