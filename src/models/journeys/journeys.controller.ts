import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JourneysService } from "./journeys.service";
import { AccountGuard } from "../../services/auth/account.guard";
import { JourneysDto } from "./dto/journeys.dto";
import { ValidationPipe } from "../../services/pipes/validation.pipe";
import { JoinJourneyDto } from "./dto/join-journey.dto";

@ApiTags('Journeys')
@Controller('journeys')
export class JourneysController {
    constructor(private journeysService: JourneysService) {}

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
  @UseGuards(AccountGuard)
  @UsePipes(ValidationPipe)
  async getJourneysByUserId(@Query() queryParams) {
      const { userId, pageNum, numPerPage } = queryParams;

      return this.journeysService.getJourneysByUserId(Number(userId), Number(pageNum), Number(numPerPage));
  }

}
