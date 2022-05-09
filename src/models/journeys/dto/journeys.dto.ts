import { IsString, Length, IsInt, IsObject, IsOptional, IsDateString, MinDate, Validate } from "class-validator";
import { ICoords } from "../journeys.model";
// import { type } from "os";
import { MinDateString } from "../../../validators/MinDateString";

const headingMin = 4;
const headingMax = 45;

const descriptionMin = 0;
const descriptionMax = 500;

export class JourneysDto {

  @IsInt({ message: 'Should be a number' })
  readonly userId?: number;

  @IsInt({ message: 'Should be a number' })
  @IsOptional()
  readonly journeyId?: number;

  @IsString({ message: 'Should be a string' })
  @Length(headingMin, headingMax, {
    message: `Heading should not be less than ${headingMin} and not more than ${headingMax}`,
  })
  readonly heading: string;

  @IsString({ message: 'Should be a string' })
  @Length(descriptionMin, descriptionMax, {
    message: `Descriptionn should not be less than ${descriptionMin} and not more than ${descriptionMax}`,
  })
  readonly description: string;


  @IsDateString()
  @IsOptional()
  @Validate(MinDateString,[new Date()], {
      message: 'The journey\'s date should be later than now'
    })
  readonly date:Date;

  @IsObject({ message: 'Should be an object' })
  readonly beginPoint: ICoords;

  @IsObject({ message: 'Should be an object' })
  readonly endPoint: ICoords;

  @IsInt({ message: 'Should be a number' })
  @IsOptional()
  readonly leadId?: number;

}
