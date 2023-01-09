import * as text from 'png-chunk-text';
import * as extractChunks from 'png-chunks-extract';

import { Metadata, PngMetadata } from '../value-objects/png-metadata';

export class MetadataExtractor {
  private extractMetadata(data: Buffer): Metadata[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const metadata = extractChunks(data) as Metadata[];
    return metadata;
  }

  public getPngMetadata(data: Buffer, file: string): PngMetadata {
    const metadata = this.extractMetadata(data);

    const tEXtMetadata = metadata.filter(
      (e) => e.name === 'tEXt' || e.name === 'iTXt',
    );
    if (!tEXtMetadata.length) {
      throw new Error(`tEXt metadata not found for file ${file}`);
    }

    const decodedBuffers: PngMetadata[] = tEXtMetadata.map((e) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      text.decode(e.data as Buffer),
    );

    const parameters: PngMetadata[] = decodedBuffers.filter(
      (buffer) => buffer.keyword === 'parameters',
    );

    // TODO: add other keywords such as 'aesthetic_score'

    return parameters[0];
  }
}
