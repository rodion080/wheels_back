import { forwardRef, Module } from "@nestjs/common";
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { File } from "./files.model";

@Module({
  controllers: [ FilesController],
  providers: [FilesService],
  imports:[SequelizeModule.forFeature([ File]),],
  exports: [FilesService]
})
//forwardRef(() => FilesModule),
export class FilesModule {}
