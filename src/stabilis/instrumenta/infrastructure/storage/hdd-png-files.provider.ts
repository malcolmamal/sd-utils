import * as fs from 'fs';
import * as path from 'path';

import { PngFilesProvider } from '../../application/interfaces/png-files.provider';

export class HddPngFilesProvider extends PngFilesProvider {
  public getPngFileContent(filePath: string): Buffer {
    return fs.readFileSync(filePath);
  }

  public getPngFiles(folderPath: string): string[] {
    const files = fs.readdirSync(folderPath);
    return files.filter((file) => file.endsWith('.png'));
  }

  public copyFile(
    sourcePath: string,
    targetFile: string,
    newFileName: string,
  ): void {
    fs.copyFile(sourcePath, `${targetFile}.png`, (err) => {
      if (err) {
        throw new Error(
          `File ${newFileName}.png was not copied to destination`,
        );
      }
    });
  }

  public createFile(
    targetPath: string,
    content: string,
    newFileName: string,
    originalFile: string,
  ): void {
    fs.writeFile(`${targetPath}.json`, content, (err) => {
      if (err) {
        throw new Error(
          `File ${newFileName}.json was not created for file ${originalFile}`,
        );
      }
    });
  }

  public moveFile(sourcePath: string, targetPath: string): void {
    const fileName = path.basename(sourcePath);

    fs.mkdirSync(targetPath, { recursive: true });
    fs.rename(sourcePath, `${targetPath}${fileName}`, (err) => {
      if (err) throw err;
    });
  }

  public fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}
