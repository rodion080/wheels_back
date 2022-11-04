import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
import { File } from '../files/files.model';
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";

@Module({
    controllers: [ UsersController ],
    providers: [ UsersService ],
    imports: [
        AuthModule,
        PassportModule,
        SequelizeModule.forFeature([ User, File ]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h',
            },
        }),
        FilesModule,
    ],
    exports: [ UsersService ],
})
export class UsersModule {}
