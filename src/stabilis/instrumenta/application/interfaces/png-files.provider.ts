export abstract class PngFilesProvider {
  abstract getPngFileContent(filePath: string): Buffer;

  abstract getPngFiles(folderPath: string): string[];

  abstract copyFile(
    sourcePath: string,
    targetFile: string,
    newFileName: string,
  ): void;

  abstract createFile(
    targetPath: string,
    content: string,
    newFileName: string,
    originalFile: string,
  ): void;

  abstract moveFile(sourcePath: string, targetPath: string): void;

  abstract fileExists(filePath: string): boolean;
}
