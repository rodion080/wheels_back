import {
    Controller,
    Get,
    Param,
    Request,
    UseInterceptors, UseGuards, Patch, UnauthorizedException
} from "@nestjs/common";
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccountGuard, getUserByRequest } from "../../services/auth/account.guard";
import { AvatarImageDto2 } from "./dto/avatar-image.dto2";
import { JwtService } from "@nestjs/jwt";
import { IFile } from "../files/utils/file.util";
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor( private usersService: UsersService, private jwtService: JwtService) {}

  @Get()
    begin() {
        return this.usersService.begin();
    }

  @Get('/:userId/details')
  @UseGuards(AccountGuard)
  getUserById(@Param() params) {
      return this.usersService.getUserById(params.userId);
  }

  @Patch('/update2')
  @UseInterceptors(FileInterceptor('image'))
  update2(@Request() req) {
      const user = getUserByRequest(req, this.jwtService);
      if(user.id !== Number(req.body.userId)){
          throw new UnauthorizedException({ message: "User is not authorized" });

      }
      const userDto2 : AvatarImageDto2 =  req.body;
      const image : IFile =  req.file;

      return this.usersService.update2(userDto2, image);
  }

}
