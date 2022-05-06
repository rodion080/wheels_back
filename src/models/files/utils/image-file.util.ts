import { FileUtil } from './file.util';
import * as path from 'path';
import * as sharp from 'sharp';
import { FileDto } from '../dto/file.dto';
export const mimeTypesAndExts = {
  png: { ext: '.png', mime: 'image/png' },
  jpg: { ext: '.jpg', mime: 'image/jpg' },
  jpeg: { ext: '.jpeg', mime: 'image/jpeg' },
};

export class ImageFileUtil extends FileUtil {
  public async saveUserAvatarAsPng(): Promise<FileDto> {
    const today = new Date();
    const pathInDb = path.join(
      'images',
      'users',
      today.getFullYear().toString(),
      today.getMonth().toString(),
    );

    this.assignUuid();
    await this.createDirectory(pathInDb);

    const filePath = path.join(
      this.getProjectPath(),
      pathInDb,
      `${this.uuid}${mimeTypesAndExts.png.ext}`,
    );

    await sharp(this.buffer).resize(300, 300).toFile(filePath);

    return {
      uuid: this.uuid,
      name: this.originalname.split('.')[0],
      path: pathInDb,
      mime: mimeTypesAndExts.png.mime,
      ext: mimeTypesAndExts.png.ext,
    };
  }
}
