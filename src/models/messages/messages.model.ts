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
import { User } from "../users/users.model";

export enum UserRoleTypes {
  ADMIN = "ADMIN",
  USER = "USER",
}

@Table({ tableName: "messages" })
export class Message extends Model<Message> {

  @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true
  })
      id: number;

  @ForeignKey(() => Journey)
  @Column({ type: DataType.INTEGER, allowNull: false })
      journeyId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, })
      userId: number;

  @Column({ type: DataType.TEXT, allowNull: false })
      content: string;

  @BelongsTo(() => Journey)
      journey: Journey;

  @BelongsTo(() => User)
      user: User;

}
