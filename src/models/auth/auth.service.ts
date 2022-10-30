import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from "sequelize";
import * as bcrypt from 'bcrypt';
import { User, UserRoleTypes } from '../users/users.model';
import { File } from '../files/files.model';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from "./dto/register-user.dto";
import { FileHub } from "../files/files-hub.model";

@Injectable()
export class AuthService {
    constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(File) private fileRepository: typeof File,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    ) {}

    public async generateToken(user: User){
        const { id, login, email } = user;
        const payload = { id, login, email };

        return { id, token: this.jwtService.sign(payload),
        };
    }

    async login(dto: LoginUserDto) {
        const user = await this.userService.getUserByEmailOrLoginAndThrowIfError({
            login: dto.loginOrEmail,
            email: dto.loginOrEmail,
        });

        const passwordEquals = await bcrypt.compare(dto.password, user.password);

        if (passwordEquals) {
            return this.generateToken(user);
        }

        throw new UnauthorizedException({
            message: 'Wrong login or email or password',
        });
    }

    async register(dto: RegisterUserDto, transaction:Transaction){
        await this.userService.throwIfSuchUserExists(dto);
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(dto.password, salt);

        const user = await User.create({ ...dto, "role":UserRoleTypes.USER, password:hashPassword }, { transaction });
        const userHub = await FileHub.create({ fileTypeId:1 }, { transaction });
        await User.update({ ...user,fileHubId: userHub.id }, { where:{ id:user.id } , transaction }  );

        return this.generateToken(user);
    }
}
