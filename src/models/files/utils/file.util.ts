import { Buffer } from 'buffer';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class FileUtil {
  protected readonly fieldname: string;
  protected readonly originalname: string;
  protected readonly encoding: string;
  protected readonly mimetype: string;
  protected readonly buffer: Buffer;
  protected readonly size: number;
  protected uuid: string | null;

  constructor(file: IFile) {
    this.fieldname = file.fieldname;
    this.originalname = file.originalname;
    this.encoding = file.encoding;
    this.mimetype = file.mimetype;
    this.buffer = file.buffer;
    this.size = file.size;
    this.uuid = null;
  }

  protected assignUuid(): void {
    if (this.uuid) {
      console.log(this.uuid);
      throw Error('Uuid is already assigned');
    }
    this.uuid = uuid.v4();
  }

  protected getFileExtension(): string {
    return path.extname(this.originalname);
  }

  protected async createDirectory(dirPath: string) {
    const absPath = path.join(this.getProjectPath(), dirPath);
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(absPath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  protected getProjectPath() {
    return path.resolve(__dirname, '..', '..', '..');
  }

  protected async saveFileByRelativePath(relativePath: string) {
    const filePath = path.join(this.getProjectPath(), relativePath);
    // const filePath = path.resolve(__dirname, '..', '..', '..', relativePath);
    this.assignUuid();

    const fileSystemName = `${this.uuid}${this.getFileExtension()}`;

    if (!fs.existsSync(filePath)) {
      await this.createDirectory(filePath);
    }
    await fs.promises.writeFile(
      path.join(filePath, fileSystemName),
      this.buffer,
    );
  }

  // protected async saveFileByRelativePath(relativePathWithFile: string) {
  //   const projectPath = this.getProjectPath();
  //   const absolutePathWithFile = path.join(projectPath, relativePathWithFile);
  //   await fs.promises.unlink(absolutePathWithFile);
  // }
}
