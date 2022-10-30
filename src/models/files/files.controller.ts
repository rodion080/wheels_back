import { Body, Controller, Delete, Get, Param, Post, Res, StreamableFile } from "@nestjs/common";
import { AddFiletypeDto } from './dto/add-filetype.dto';
import { FilesService } from './files.service';
import { FileDto } from "./dto/image.dto";

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

  @Post('addFileType')
    addFileType(@Body() dto: AddFiletypeDto) {
        return this.filesService.addFileType(dto);
    }

  @Get('image/:uuid')
  async getImageByUuid(@Param() params ) {
      const file2 = await this.filesService.getImageByUuid(params.uuid);

      return new StreamableFile(file2);
  }

  @Delete('removeFile')
  async removeFileWithDb(@Body() dto:FileDto) {
      console.log(1);
      console.log("uuid", dto.uuid);

      return  await this.filesService.removeFileWithDb(dto.uuid);
  }

}
