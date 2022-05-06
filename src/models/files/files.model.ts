import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { FileHub } from './files-hub.model';

// interface UserCreationAttribute {
//   email: string;
//   password: string;
// }

@Table({ tableName: 'files', timestamps: false })
export class File extends Model<File> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false,
  })
  uuid: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  path: string;

  @Column({ type: DataType.STRING,  allowNull: false })
  mime: string;

  @Column({ type: DataType.STRING,  allowNull: false })
  ext: string;

  @ForeignKey(() => FileHub)
  @Column({ type: DataType.INTEGER, allowNull: false })
  fileHubId: number;

  @BelongsTo(() => FileHub)
  fileHub: FileHub;

}