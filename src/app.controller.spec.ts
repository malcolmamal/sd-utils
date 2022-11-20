import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
  AppService,
  PngParsedMetadata,
  PNG_TEXT_KEYWORD,
  SOURCE_PATH,
} from './app.service';

describe(AppController.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return metadata', () => {
      const appController = app.get(AppController);
      const metadata = appController.getPngTextMetadata(
        'example/grid-0134.png',
      );
      expect(metadata.keyword).toBe('parameters');
      expect(metadata.text).toMatch('Negative prompt');
      expect(metadata.text).toMatch('Model');
    });

    it('should parse metadata', () => {
      const appController = app.get(AppController);

      const prompt =
        'professional photograph of sks woman, ((detailed face)), (High Detail), Sharp, 8k, ((bokeh))';
      const negativePrompt =
        '(((duplicate))), ((mole)), ((blemish)), ((morbid)), ((wrinkles)), ((mutilated)), [out of frame], extra fingers, mutated hands';
      const steps = 50;
      const sampler = 'Euler a';
      const cfg = 7.5;
      const seed = 2941991778;
      const size = '512x704';
      const modelHash = '333ecf3c';
      const model = 'model_miley_v1_5000';

      const metadata = {
        keyword: PNG_TEXT_KEYWORD,
        text:
          `${prompt} ` +
          `Negative prompt: ${negativePrompt}, ` +
          `Steps: ${steps}, ` +
          `Sampler: ${sampler}, ` +
          `CFG scale: ${cfg}, ` +
          `Seed: ${seed}, ` +
          `Size: ${size}, ` +
          `Model hash: ${modelHash}, ` +
          `Model: ${model}`,
      };

      const parsed = appController.getParsedPngMetadata(metadata);
      expect(parsed).toEqual<PngParsedMetadata>({
        prompt,
        negativePrompt,
        steps,
        sampler,
        cfg,
        seed,
        size,
        modelHash,
        model,
      });
    });

    it.only('should organize grid files', async () => {
      const appController = app.get(AppController);
      const files = appController.getPngFiles(SOURCE_PATH);

      if (!files.length) {
        fail('No files to process');
      }

      appController.organizeGrids(SOURCE_PATH, files);
    });

    it('should organize output files', async () => {
      const appController = app.get(AppController);
      const files = appController.getPngFiles(SOURCE_PATH);

      if (!files.length) {
        fail('No files to process');
      }

      appController.organizeOutputs(SOURCE_PATH, files);
    });
  });
});
