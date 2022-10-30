import { Transaction } from "sequelize";
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Login200 } from './swagger/login.200';
import { Common500 } from '../../swagger/common-types/common.500';
import { RegisterUserDto } from "./dto/register-user.dto";
import { TransactionInterceptor, TransactionParam } from "../../database";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
    private authService: AuthService,
    ) {}

  @Post('/login')
  @ApiCreatedResponse({
      status: 200,
      description: 'User logged in',
      type: Login200,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.', type: Common500 })
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

  @Post('/register')
  @ApiCreatedResponse({
      status: 200,
      description: 'User logged in',
      type: Login200,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.', type: Common500 })
  @UseInterceptors(TransactionInterceptor)
  register(@Body() registerUserDto: RegisterUserDto, @TransactionParam() transaction: Transaction ) {
      return this.authService.register(registerUserDto, transaction);
  }
}
