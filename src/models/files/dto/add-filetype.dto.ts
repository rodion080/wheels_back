import { IsString } from 'class-validator';

export class AddFiletypeDto {
  @IsString({ message: 'Should be a string' })
    readonly id: number;

  @IsString({ message: 'Should be a string' })
  readonly name: string;
}
