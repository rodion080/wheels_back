import { ApiProperty } from '@nestjs/swagger';

export class Login200 {
    @ApiProperty({
        default:1
    })
    readonly id: number;

    @ApiProperty({
        default:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJyb2Rpb24wODAiLCJlbWFpbCI6InJvZGlvbjA4MEBnbWFpbC5jb20iLCJpYXQiOjE2NjcxMTIwNzcsImV4cCI6MTY2NzE5ODQ3N30.8-swPxlB5OxGbkY8q5Q7oGfR3-bLHmFJ5yMykaNNrKw'
    })
    readonly token: string;
}
