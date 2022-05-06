import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { FileType } from './file-types.model';
import { File } from './files.model';
import { User } from '../users/users.model';
import { Journey } from "../journeys/journeys.model";

// interface UserCreationAttribute {
//   email: string;
//   password: string;
// }

@Table({ tableName: 'filesHub', timestamps: false })
export class FileHub extends Model<FileHub> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => FileType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileTypeId: number;

  @BelongsTo(() => FileType)
  fileType: FileType;

  @HasMany(() => File)
  files: File[];

  @HasOne(() => User)
  user: User;

  @HasOne(() => Journey)
  journey: Journey;

}