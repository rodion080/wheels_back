import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import  { Op } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { Sequelize } from 'sequelize-typescript';
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

  private async createUserHub(userId: number) {
    const hub = new FileHub();
    hub.fileTypeId = 1;
    return await hub.save();
  }

  async getUserById(userId: number) {
    return await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id: userId },
      attributes: ['createdAt',  'email', 'id', 'login', 'description' ],
      include: [{
          model: FileHub,
          include: [{
              model: File,
            }],
        }],
    });
  }


  async create(dto: CreateUserDto) {
    if (await this.getUser(dto)) {
      throw new HttpException(
        'User with such email of login already exists',
        HttpStatus.CONFLICT,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(dto.password, salt);
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.description = dto.description;
    user.role = 'USER';
    user.password = hashPassword;
    const userResult = await user.save();
    const { id: hubId } = await this.createUserHub(userResult.id);
    user.fileHubId = hubId;
    user.save();
    return this.generateToken(userResult);
  }

  async login(dto: LoginUserDto) {
    const user = await this.getUser({
      login: dto.loginOrEmail,
      email: dto.loginOrEmail,
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Wrong login or email or password',
      });
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (passwordEquals) {
      return this.generateToken(user);
    }

    throw new UnauthorizedException({
      message: 'Wrong login or email or password',
    });
  }

  private async getUser(dto: { login: string; email: string }) {
    const users = await this.userRepository.findAll({
      where: {
        [Op.or]: [{ login: dto.login }, { email: dto.email }],
      },
    });
    if (!users.length) {
      return null;
    }
    return users[0];
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, login: user.login, email: user.email };
    return {
      id: user.id,
      token: this.jwtService.sign(payload),
    };
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
          const {uuid, ext, path} = file;
          await this.fileService.removeFile({uuid,ext,path});
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
