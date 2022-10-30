import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import  { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from './users.model';
import { FilesService } from '../files/files.service';
import { File } from '../files/files.model';
import { IFile } from '../files/utils/file.util';
import { mimeTypesAndExts } from '../files/utils/image-file.util';
import { FileHub } from '../files/files-hub.model';
import { AvatarImageDto2 } from "./dto/avatar-image.dto2";

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(File) private fileRepository: typeof File,
    private jwtService: JwtService,
    private fileService: FilesService,
    private sequelize: Sequelize,
    ) {}

    begin(): string {
        return "Los geht's!";
    }

    async getUserById(userId: number) {
        return await this.userRepository.findOne({
            rejectOnEmpty: undefined,
            where: { id: userId },
            attributes: [ 'createdAt',  'email', 'id', 'login', 'description' ],
            include: [ {
                model: FileHub,
                include: [ {
                    model: File,
                } ],
            } ],
        });
    }

    private async getUser(dto: { login: string; email: string }) {
        const { login , email } = dto;
        const user = await this.userRepository.findOne({
            where: {
                [Op.or]: [ { login }, { email } ],
            },
        });
        if (!user) {
            return null;
        }

        return user;
    }

    public async getUserByEmailOrLoginAndThrowIfError(dto: { login: string; email: string }){
        const user = await this.getUser(dto);
        if (!user) {
            throw new HttpException(
                'Wrong login or email or password',
                HttpStatus.NOT_FOUND
            );
        }

        return user;
    }

    public async throwIfSuchUserExists(dto: { login: string; email: string }) : Promise<void> {
        const user = await this.getUser(dto);
        if (user) {
            throw new HttpException(
                'User with such email of login already exists',
                HttpStatus.CONFLICT,
            );
        }
    }

    private mimeTypeControl(image) {
        const allowedMimeTypes = Object.keys(mimeTypesAndExts).map(
            (extName) => mimeTypesAndExts[extName].mime,
        );
        if (!allowedMimeTypes.includes(image.mimetype)) {
            throw new HttpException(
                'The file type is not allowed to be an avatar',
                HttpStatus.CONFLICT,
            );
        }
    }

    async update2(dto: AvatarImageDto2, image?: IFile) {
        try {
            await this.sequelize.transaction(async (t) => {
                const testUser = await this.getUser({ login: dto.login, email: dto.email });
                if (testUser) {
                    const loginSame = dto.login === testUser.login;
                    const emailSame = dto.email === testUser.email;
                    const idSame = Number(dto.userId) === testUser.id;

                    if(!idSame && (loginSame || emailSame ) ){
                        throw new HttpException(
                            'User with such email or login already exists',
                            HttpStatus.CONFLICT,
                        );
                    }
                }
                const user = await this.getUserById(dto.userId);
                user.login = dto.login;
                user.email = dto.email;
                user.description= dto.description;
                await user.save();

                if(typeof image !== 'undefined' && user.fileHub.files.length) {
                    this.mimeTypeControl(image);
                    const existingFileUuid = user.fileHub.files[0].uuid;
                    const dbObject = await this.fileService.createFile(image);
                    const file = await this.fileRepository.findByPk(existingFileUuid);
                    const { uuid, ext, path } = file;
                    await this.fileService.removeFile({ uuid,ext,path });
                    await File.update(
                        { uuid: dbObject.uuid, name: dbObject.name, path: dbObject.path },
                        { where: { uuid: file.uuid } },
                    );
                }else if(typeof image !== 'undefined' && !user.fileHub.files.length){
                    const dbObject = await this.fileService.createFile(image);
                    await this.fileRepository.create({ ...dbObject, fileHubId:user.fileHub.id });
                }else if(!dto.notRemoveAvatar) {
                    if(user.fileHub.files.length){
                        const fileCandidate = this.fileRepository.findByPk(user.fileHub.files[0].uuid);
                        if(fileCandidate){
                            await this.fileService.removeFileWithDb(user.fileHub.files[0].uuid);
                        }
                    }
                }
            });
        }catch (e) {
            throw e;
        }
    }
}
