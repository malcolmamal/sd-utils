import { Test, TestingModule } from '@nestjs/testing';

import { PNG_TEXT_KEYWORD } from '../../application/services/instrumenta.service';
import { MetadataParser } from './metadata.parser';

describe(MetadataParser.name, () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [MetadataParser],
    }).compile();
  });

  it('should parse metadata', () => {
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

    const parser = app.get(MetadataParser);
    const parsedData = parser.parseMetadata(metadata);

    expect(parsedData).toEqual({
      steps: 30,
      sampler: 'DPM++ 2M Karras',
      cfgScale: 7,
      seed: 4138086606,
      size: '896x1472',
      modelHash: 'e068128d',
      model: 'model_morgana_v5_2500',
      denoisingStrength: 0.35,
      firstPassSize: '0x0',
      prompt:
        'A stunning intricate full color portrait of (sks woman), (30 year old sks woman) as fantasy supervillain, intricate, elegant, masterpiece, ((goddess of death and blood)), high fashion,\n' +
        '      (futuristic viking warrior in alien cyberpunk armor), leather, ((dystopian)), ((grindhouse)), (road warrior),\n' +
        '      ((tattoo))\n' +
        '      epic character composition,\n' +
        '      matte skin, pores, wrinkles, hyperdetailed, hyperrealistic,\n' +
        '      Moody Lighting, Hasselblad Award Winner, Soft Diffuse Lighting,  Smirk,\n' +
        '      by ilya kuvshinov, alessio albi, nina masic,\n' +
        '      sharp focus, natural lighting, subsurface scattering, f2, 35mm, film grain,',
      negativePrompt:
        '(mutation), disfigurement, (mystical), (drawing), ((cat)), ((animal)), (kitten), cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)), ((poorly drawn)), ((extra limbs)), ((close up)), ((b&w)), weird colors, blurry, render',
    });
  });
});
