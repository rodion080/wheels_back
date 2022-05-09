import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany
} from "sequelize-typescript";
import { FileHub } from "../files/files-hub.model";
import { UserJourney } from "../journeys/user-journey.model";
import { Journey } from "../journeys/journeys.model";

interface UserCreationAttribute {
  email: string;
  password: string;
}

export enum UserRoleTypes {
  ADMIN = "ADMIN",
  USER = "USER",
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttribute> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({
    type: DataType.ENUM(UserRoleTypes.ADMIN, UserRoleTypes.USER),
    allowNull: false,
    defaultValue: UserRoleTypes.USER
  })
  role: string;

  @Column({ type: DataType.TEXT,  allowNull: true })
  description: string;

  @ForeignKey(() => FileHub)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  fileHubId: number;

  @BelongsTo(() => FileHub)
  fileHub: FileHub;

  @HasMany(()=>Journey )
  userJourneys: Journey[];

  @BelongsToMany(()=>Journey, () =>UserJourney )
  journeys: Journey[];



}