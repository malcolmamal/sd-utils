import { Test, TestingModule } from '@nestjs/testing';

import {
  InstrumentaService,
  PNG_TEXT_KEYWORD,
  PngParsedMetadata,
  SOURCE_PATH,
} from '../services/instrumenta.service';
import { InstrumentaController } from './instrumenta.controller';

describe(InstrumentaController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [InstrumentaController],
      providers: [InstrumentaService],
    }).compile();
  });

  describe('parsing', () => {
    it('should return metadata', () => {
      const appController = app.get(InstrumentaController);
      const metadata = appController.getPngTextMetadata(
        'example/grid-0134.png',
      );
      expect(metadata.keyword).toBe('parameters');
      expect(metadata.text).toMatch('Negative prompt');
      expect(metadata.text).toMatch('Model');
    });

    it('should parse correctly', () => {
      const appController = app.get(InstrumentaController);

      const metadata = {
        keyword: PNG_TEXT_KEYWORD,
        text: `A stunning intricate full color portrait of (sks woman), (30 year old sks woman) as fantasy supervillain, intricate, elegant, masterpiece, ((goddess of death and blood)), high fashion,
        (futuristic viking warrior in alien cyberpunk armor), leather, ((dystopian)), ((grindhouse)), (road warrior),
        ((tattoo))
        epic character composition,
        matte skin, pores, wrinkles, hyperdetailed, hyperrealistic,
        Moody Lighting, Hasselblad Award Winner, Soft Diffuse Lighting,  Smirk,
        by ilya kuvshinov, alessio albi, nina masic,
        sharp focus, natural lighting, subsurface scattering, f2, 35mm, film grain,
        Negative prompt: (mutation), disfigurement, (mystical), (drawing), ((cat)), ((animal)), (kitten), cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)), ((poorly drawn)), ((extra limbs)), ((close up)), ((b&w)), weird colors, blurry, render
        Steps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 4138086606, Size: 896x1472, Model hash: e068128d, Model: model_morgana_v5_2500, Denoising strength: 0.35, First pass size: 0x0`,
      };
      const parsed = appController.getParsedPngMetadata(metadata);
      console.log(parsed);
      expect(parsed).toBeInstanceOf(PngParsedMetadata);
    });

    it('should parse metadata', () => {
      const appController = app.get(InstrumentaController);

      const prompt =
        'professional photograph of sks woman, ((detailed face)), (High Detail), Sharp, 8k, ((bokeh))';
      const negativePrompt =
        '(((duplicate))), ((mole)), ((blemish)), ((morbid)), ((wrinkles)), ((mutilated)), [out of frame], extra fingers, mutated hands';
      const steps = 50;
      const sampler = 'Euler a';
      const cfgScale = 7.5;
      const seed = 2941991778;
      const size = '512x704';
      const modelHash = '333ecf3c';
      const model = 'model_miley_v1_5000';
      const denoisingStrength = 2;
      const firstPassSize = 'asd';

      const metadata = {
        keyword: PNG_TEXT_KEYWORD,
        text:
          `${prompt} ` +
          `Negative prompt: ${negativePrompt} ` +
          `Steps: ${steps}, ` +
          `Sampler: ${sampler}, ` +
          `CFG scale: ${cfgScale}, ` +
          `Seed: ${seed}, ` +
          `Size: ${size}, ` +
          `Model hash: ${modelHash}, ` +
          `Model: ${model}`,
      };

      const parsed = appController.getParsedPngMetadata(metadata);
      console.log(parsed);
      expect(parsed).toEqual<PngParsedMetadata>({
        prompt,
        negativePrompt,
        steps,
        sampler,
        cfgScale,
        seed,
        size,
        modelHash,
        model,
        denoisingStrength,
        firstPassSize,
      });
    });

    it('should organize grid files', () => {
      const appController = app.get(InstrumentaController);
      const files = appController.getPngFiles(SOURCE_PATH);

      expect(files).toBeInstanceOf(Array);

      if (!files.length) {
        throw new Error('No files to process');
      }

      appController.organizeGrids(SOURCE_PATH, files);
    });

    it.only('should organize output files', () => {
      const appController = app.get(InstrumentaController);
      const files = appController.getPngFiles(SOURCE_PATH);

      expect(Array.isArray(files)).toBe(true);

      if (!files.length) {
        throw new Error('No files to process');
      }

      appController.organizeOutputs(SOURCE_PATH, files);
    });

    it('should generate seeds list', () => {
      const appController = app.get(InstrumentaController);
      const files = appController.getPngFiles(SOURCE_PATH);

      expect(files).toBeInstanceOf(Array);

      if (!files.length) {
        throw new Error('No files to process');
      }

      const result = appController.extractSeeds(SOURCE_PATH, files);
      console.log(result);
    });
  });
});
