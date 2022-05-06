import { Module } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserJourney } from "./user-journey.model";
import { Journey } from "./journeys.model";
import { FilesService } from "../files/files.service";
import { File } from "../files/files.model";

@Module({
  providers: [JourneysService, FilesService],
  controllers: [JourneysController],
  imports:[
    SequelizeModule.forFeature([User, UserJourney, Journey, File]),
  ],
  exports: [JourneysService],
})
export class JourneysModule {}
