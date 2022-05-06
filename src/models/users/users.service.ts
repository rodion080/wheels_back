import {
  Injectable,
  // OnModuleInit,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { AvatarImageDto } from './dto/avatar-image.dto';
import { FilesService } from '../files/files.service';
import { Sequelize } from 'sequelize-typescript';
import { File } from '../files/files.model';
import { IFile } from '../files/utils/file.util';
import { mimeTypesAndExts } from '../files/utils/image-file.util';
import { FileHub } from '../files/files-hub.model';

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

  async update(dto: CreateUserDto) {
    console.log(dto);// { login: string; email: string }
    const testUser = await this.getUser({ login: dto.login, email: dto.email });
    if (testUser) {
      const loginSame = dto.login === testUser.login;
      const emailSame = dto.email === testUser.email;
      const descrSame = dto.description === testUser.description;
      const idSame = dto.userId === testUser.id;
      console.log(loginSame);
      console.log(emailSame);
      console.log(descrSame);
      if(loginSame && emailSame && descrSame && idSame ){
        return {status:200};
      }

      if(!idSame && (loginSame || emailSame ) ){
        throw new HttpException(
          'User with such email of login already exists',
          HttpStatus.CONFLICT,
        );
      }
    }
    const user = await this.getUserById(dto.userId);
    user.login= dto.login;
    user.email= dto.email;
    user.description= dto.description;
    return await user.save();
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
    return this.generateToken(await user.save());
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

  async avatarUpdate(dto: AvatarImageDto, image) {
    try {
      this.mimeTypeControl(image);
      const user = (
        await this.userRepository.findAll({
          where: [{ id: dto.userId }],
          include: { all: true, nested: true },
        })
      )[0];
      const existingFileUuid = user.fileHub.files[0].uuid;
      const dbObject = await this.fileService.createFile(image);
      const file = await this.fileRepository.findByPk(existingFileUuid);
      await this.fileService.removeFile({
        uuid: file.uuid,
        ext: file.ext,
        path: file.path,
      });
      await File.update(
        { uuid: dbObject.uuid, name: dbObject.name, path: dbObject.path },
        { where: { uuid: file.uuid } },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async avatarUpload(dto: AvatarImageDto, image: IFile) {
    try {
      this.mimeTypeControl(image);
      const users = await this.userRepository.findAll({
        where: [{ id: dto.userId }],
        include: { all: true, nested: true },
      });

      if(users[0].fileHub){
        if (users[0].fileHub.files.length) {
          throw new HttpException(
            'This user already has an avatar',
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const { id: hubId } = await this.createUserHub(dto.userId);
        // const { id: hubId } = await this.fileService.createUserHub(dto.userId);
        const user = await this.userRepository.findByPk(dto.userId);
        user.fileHubId = hubId;
        user.save();
        const dbObject = await this.fileService.createFile(image);
        await this.fileRepository.create({ ...dbObject, fileHubId:hubId });
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
