import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Journey } from "./journeys.model";

@Table({ tableName: 'user_journey', createdAt: false, updatedAt: false })
export class UserJourney extends Model<UserJourney> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
      id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, })
      userId: number;

  @ForeignKey(() => Journey)
  @Column({ type: DataType.INTEGER, allowNull: false, })
      journeyId: number;

  // @BelongsTo(() => User)
  // fileType: FileType;

  // @HasMany(() => User)
  // users: User[];
  //
  @BelongsTo(() => Journey)
      journeys: Journey[];

  @BelongsTo(() => User)
      users: User[];

    // @HasOne(() => User)
    // user: User;
    //
    // @HasOne(() => Journey)
    // journey: Journey;

}
