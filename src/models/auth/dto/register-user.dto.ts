import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        description: 'Login',
        default:'rodion080'
    })
    readonly login: string;

    @ApiProperty({
        description: 'Email',
        default:'rodion080@gmail.com'
    })
    readonly email: string;


    @ApiProperty({
        description: 'User password',
        default:'123456'
    })
    readonly password: string;
}
