import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  cfgScale: number;

  @IsNumber()
  seed: number;

  @IsString()
  size: string;

  @IsString()
  modelHash: string;

  @IsString()
  model: string;

  @IsNumber()
  @IsOptional()
  denoisingStrength?: number;

  @IsString()
  @IsOptional()
  firstPassSize?: string;
}
