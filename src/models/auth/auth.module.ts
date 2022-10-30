import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from "../files/files.module";
import { JwtModule } from "@nestjs/jwt";
import { User } from "../users/users.model";
import { File } from "../files/files.model";
import { AuthService } from "./auth.service";
import { TransactionInterceptor } from "../../database";
import { Sequelize } from "sequelize-typescript";


@Module({
    controllers:[ AuthController ],
    providers: [ AuthService , TransactionInterceptor,
        { provide: 'SEQUELIZE', useExisting: Sequelize }, ],
    imports: [
        forwardRef(() => UsersModule),
        FilesModule,
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h',
            },
        }),
        SequelizeModule.forFeature([ User, File ]) ],
    exports: [ AuthService ],
})
export class AuthModule {
}
