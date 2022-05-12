import { Module } from '@nestjs/common';
import { JourneysService } from './journeys.service';
import { JourneysController } from './journeys.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserJourney } from "./user-journey.model";
import { Journey } from "./journeys.model";
import { FilesService } from "../files/files.service";
import { File } from "../files/files.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [JourneysService, FilesService],
  controllers: [JourneysController],
  imports:[
    SequelizeModule.forFeature([User, UserJourney, Journey, File]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JourneysService],
})
export class JourneysModule {}
