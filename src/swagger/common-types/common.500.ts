import { ApiProperty } from '@nestjs/swagger';

export class Common500 {
    @ApiProperty({
        default:'error'
    })
    readonly message: string;

    @ApiProperty({
        default:'VALIDATION_ERROR'
    })
    readonly error: string;


    @ApiProperty({
        default:'string'
    })
    readonly description: string;

    @ApiProperty({
        default:{}
    })
    readonly data: typeof Object;


}
