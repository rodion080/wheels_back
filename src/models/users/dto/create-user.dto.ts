import { IsString, Length, IsEmail, IsInt } from "class-validator";

const passMin = 4;
const passMax = 16;

const loginMin = 5;
const loginMax = 20;

const descriptionMin = 0;
const descriptionMax = 250;

export class CreateUserDto {

  @IsInt({ message: 'Should be a number' })
  readonly userId?: number;

  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Wrong email' })
  @Length(loginMin, loginMax, {
    message: `Login should not be less than ${loginMin} and not more than ${loginMax}`,
  })
  readonly login: string;

  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Wrong email' })
  readonly email: string;

  @IsString({ message: 'Should be a string' })
  @Length(passMin, passMax, {
    message: `Password should not be less than ${passMin} and not more than ${passMax}`,
  })
  readonly password?: string;

  @IsString({ message: 'Should be a string' })
  @Length(passMin, passMax, {
    message: `Description should not be less than ${descriptionMin} and not more than ${descriptionMax}`,
  })
  readonly description: string;

}
