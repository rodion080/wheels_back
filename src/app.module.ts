import { Module } from '@nestjs/common';
import { UsersModule } from './models/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './models/users/users.model';
import { JourneysModule } from './models/journeys/journeys.module';
import { FilesModule } from './models/files/files.module';
import { FileType } from './models/files/file-types.model';
import { FileHub } from './models/files/files-hub.model';
import { File } from './models/files/files.model';
import { Journey } from "./models/journeys/journeys.model";
import { UserJourney } from "./models/journeys/user-journey.model";

// const sequelizeConfig = {
//   dialect: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: Number(process.env.POSTGRES_PORT),
//   username: process.env.POSTGRES_USER,
//   password: String(process.env.POSTGRES_PASSWORD),
//   database: process.env.POSTGRES_DB,
//   models: [User, FileType, FileHub, File, Journey, UserJourney],
//   autoLoadModels: true,
//   synchronize: true,
// };

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [User, FileType, FileHub, File, Journey, UserJourney],
      // autoLoadModels: true,
      // synchronize: true,
    }),
    UsersModule,
    JourneysModule,
    FilesModule,
  ],
})
export class AppModule {}
