import {
  Controller,
  Get,
  Post,
  UploadedFile,
  Body,
  Param,
  UseInterceptors, UseGuards, Patch
} from "@nestjs/common";
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarImageDto } from './dto/avatar-image.dto';
import { AccountGuard } from "../../auth/account.guard";
// import { User } from './users.model';
// import { FilesService } from '../files/files.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  begin() {
    return this.usersService.begin();
  }

  @Get('/:userId')
  @UseGuards(AccountGuard)
  getUserById(@Param() params) {
    return this.usersService.getUserById(params.userId);
  }

  @Post('/create')
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Patch('/update')
  @UseGuards(AccountGuard)
  update(@Body() userDto: CreateUserDto) {
    return this.usersService.update(userDto);
  }

  @Post('/avatarUpdate')
  @UseInterceptors(FileInterceptor('image'))
  async avatarUpdate(@Body() dto: AvatarImageDto, @UploadedFile() image) {
    return this.usersService.avatarUpdate(dto, image);
  }

  @Post('/avatarUpload')
  @UseInterceptors(FileInterceptor('image'))
  async avatarUpload(@Body() dto: AvatarImageDto, @UploadedFile() image) {
    return this.usersService.avatarUpload(dto, image);
  }
}
