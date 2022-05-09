import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JourneysService } from "./journeys.service";
import { AccountGuard } from "../../auth/account.guard";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { JourneysDto } from "./dto/journeys.dto";
import { ValidationPipe } from "../../pipes/validation.pipe";
import { JoinJourneyDto } from "./dto/join-journey.dto";

@ApiTags('Journeys')
@Controller('journeys')
export class JourneysController {
  constructor(private journeysService: JourneysService) {}

  // @Get('/getJourneysByUserId/:userId')
  // // @UseGuards(AccountGuard)
  // getJourneysByUserId(@Param() params) {
  //   return this.journeysService.getJourneysByUserId(params.userId);
  // }
  //
  // @Get('/getJourneysByCity/:city')
  // // @UseGuards(AccountGuard)
  // getJourneysByCity(@Param() params) {
  //   return this.journeysService.getJourneysByCity(params.city);
  // }

  @Post('/create')
  // @UseGuards(AccountGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() journeysDto: JourneysDto) {
    return this.journeysService.create(journeysDto);
  }

  @Patch('/update')
  // @UseGuards(AccountGuard)
  @UsePipes(ValidationPipe)
  async update(@Body() journeysDto: JourneysDto) {
    return this.journeysService.update(journeysDto);
  }

  @Post('/join')
  // @UseGuards(AccountGuard)
  @UsePipes(ValidationPipe)
  async joinJourney(@Body() joinJourneyDto: JoinJourneyDto) {
    return this.journeysService.joinJourney(joinJourneyDto);
  }


  @Get('/getJourneysByUserId')
  // @UseGuards(AccountGuard)
  @UsePipes(ValidationPipe)
  async getJourneysByUserId(@Query() queryParams) {
    const {userId, pageNum, numPerPage} = queryParams;
    return this.journeysService.getJourneysByUserId(Number(userId), Number(pageNum), Number(numPerPage));
  }




}
