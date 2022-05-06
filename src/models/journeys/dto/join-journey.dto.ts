import { IsString, Length, IsInt, IsObject, IsOptional, IsDateString, MinDate, Validate } from "class-validator";
import { ICoords } from "../journeys.model";


export class JoinJourneyDto {
  @IsInt({ message: 'Should be a number' })
  readonly userId?: number;

  @IsInt({ message: 'Should be a number' })
  readonly journeyId: number;
}
