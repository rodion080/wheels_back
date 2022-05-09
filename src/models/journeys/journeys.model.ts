import { Model, Table, Column, DataType, BelongsToMany, ForeignKey, BelongsTo, HasOne, HasMany } from "sequelize-typescript";
import { UserJourney } from "./user-journey.model";
import { User } from "../users/users.model";
import { FileHub } from "../files/files-hub.model";



export interface ICoords{
  readonly lat:number
  readonly lon:number
}

interface UserCreationAttribute {
  readonly heading: string;
  readonly description: string;
  readonly lead: number;
  readonly beginPoint: ICoords;
  readonly endPoint: ICoords;
}

@Table({ tableName: 'journeys' })
export class Journey extends Model<Journey> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  heading: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  description: string;

  @Column({ type: DataType.DATE, unique: false, allowNull: true })
  date: Date;

  @Column({ type: DataType.JSONB, unique: false, allowNull: false })
  beginPoint:ICoords;

  @Column({ type: DataType.JSONB, unique: false, allowNull: false })
  endPoint:ICoords;

  @ForeignKey(() => FileHub)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  fileHubId: number;

  @BelongsTo(() => FileHub)
  fileHub: FileHub;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  leadId: number;

  @BelongsTo(()=>User)
  lead:User;

  @BelongsToMany(()=>User, () =>UserJourney )
  participants:User[];

  @HasMany(()=>UserJourney)
  userJourney:UserJourney;

}