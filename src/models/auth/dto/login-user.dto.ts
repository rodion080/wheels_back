import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        description: 'Login o email',
        default:'rodion080'
    })
    readonly loginOrEmail: string;


    @ApiProperty({
        description: 'User password',
        default:'123456'
    })
    readonly password: string;
}
