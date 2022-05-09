import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { UserJourney } from "./user-journey.model";
import { JourneysDto } from "./dto/journeys.dto";
import { Journey } from "./journeys.model";
import { FilesService } from "../files/files.service";
import { Sequelize } from "sequelize-typescript";
import { FileHub } from "../files/files-hub.model";
import { JoinJourneyDto } from "./dto/join-journey.dto";
import { File } from "../files/files.model";
//TODO token to update avatar
//TODO wrap in transaction user update
//TODO why do we need the second argument while create a db model
//TODO guard journeys
//TODO When token finished, set localstorage data null

@Injectable()
export class JourneysService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserJourney) private userJourneyRepository: typeof UserJourney,
    @InjectModel(Journey) private journeyRepository: typeof Journey,
    // @InjectModel(UserJourney) private userJourney: typeof UserJourney,
    private fileService: FilesService,
    private sequelize: Sequelize,
    // private jwtService: JwtService,
    // private fileService: FilesService,
    // private sequelize: Sequelize,
  ) {}

  private async createJourneyHub(userId: number) {
    const hub = new FileHub();
    hub.fileTypeId = 2;
    return await hub.save();
  }

  async create(journeysDto: JourneysDto){
    // console.log('journeysDto', journeysDto);
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const journey = await this.journeyRepository.create({...journeysDto, leadId:journeysDto.userId});
        const { id: hubId } = await this.createJourneyHub(journeysDto.journeyId);
        journey.fileHubId = hubId;
        await journey.save();
        return journey;
      });
    } catch (e) {
      throw e;
    }
  }


  async joinJourney(joinJourneyDto: JoinJourneyDto){
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const jounreyCandidate = await this.journeyRepository.findOne(
          {where:{id:joinJourneyDto.journeyId}}
        );
        if(!jounreyCandidate){
          throw new HttpException(
            'The journey with such id does not exist',
            HttpStatus.NOT_FOUND,
          );
        }
        const transactionHost = { transaction: t };
        const {userId, journeyId} = joinJourneyDto;
        const candidate = await this.userJourneyRepository.findOne(
          {where:{userId, journeyId}}
        );
        if(candidate){
          throw new HttpException(
            'User already joined this journey',
            HttpStatus.CONFLICT,
          );
        }
        return await this.userJourneyRepository.create(joinJourneyDto);
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async getJourneysByUserId(userId:number,pageNum:number, numPerPage:number){
    const since = ( pageNum - 1 )  * numPerPage;
    // const to = since + numPerPage;
    return await this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };
      const journeys =  await this.journeyRepository.findAll({
        // rejectOnEmpty: undefined,
        attributes: ['id', 'heading', 'description','date', 'beginPoint', 'endPoint'  ],
        order:[['id', 'ASC']],
        limit:numPerPage,
        offset: since,
        include:[{
          model:UserJourney,
          where: { userId },
        }]
      });

      const overallNumber = ( await this.journeyRepository.findAll({
        // rejectOnEmpty: undefined,
        attributes: ['id', 'heading', 'description','date', 'beginPoint', 'endPoint'  ],
        order:[['id', 'ASC']],
        include:[{
          model:UserJourney,
          where: { userId },
        }]
      })).length;

      return {
        journeys,
        overallNumber
      };
    });
  } catch (e) {
    throw e;
  }


  async update(journeysDto: JourneysDto){
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        await this.journeyRepository.update(journeysDto, {where:{
          id:journeysDto.journeyId
          }});
        // const { id: hubId } = await this.createJourneyHub(journeysDto.journeyId);
        // journey.fileHubId = hubId;
        // await journey.save();
        // return journey;
      });
    } catch (e) {
      throw e;
    }
  }



}
