import { Injectable } from '@nestjs/common';
import { FileType } from './file-types.model';
import { AddFiletypeDto } from './dto/add-filetype.dto';
import { ImageFileUtil } from './utils/image-file.util';
import { IFile } from './utils/file.util';
import { FileDto } from './dto/file.dto';
import * as path from 'path';
import * as fs from 'fs';
import { InjectModel } from "@nestjs/sequelize";
import { File } from "./files.model";

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private fileRepository: typeof File) {}

  addFileType(dto: AddFiletypeDto) {
    const fileType = new FileType();
    fileType.id = dto.id;
    fileType.name = dto.name;
    return fileType.save();
  }

  async getImageByUuid(uuid:string){
    const file = await this.fileRepository.findOne({where:{uuid}});
    const absPathWithFile = path.join(
      path.resolve(__dirname, '..', '..'),
      file.getDataValue('path'),
      `${file.getDataValue('uuid')}${file.getDataValue('ext')}`
    );
    console.log('absPathWithFile', absPathWithFile);
    const file2 = fs.createReadStream(absPathWithFile);
    return file2;
  }



  async createFile(file: IFile): Promise<FileDto> {
    const imgFileUtil = new ImageFileUtil(file);
    return imgFileUtil.saveUserAvatarAsPng();
  }

  async removeFile(file) {
    const projectPath = path.resolve(__dirname, '..', '..');
    const absolutePathWithFile = path.join(
      projectPath,
      file.path,
      `${file.uuid}${file.ext}`,
    );
    await fs.promises.unlink(absolutePathWithFile);
  }

  async removeFileWithDb(uuid:string){
    try {
      const file = await this.fileRepository.findOne({where:{uuid}});
      console.log('file', file);
      await this.removeFile(file);
      return await file.destroy();
    }catch (e) {
      throw e;
    }
  }
}
