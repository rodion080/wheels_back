import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { FileHub } from './files-hub.model';

@Table({ tableName: 'filesTypes', timestamps: false })
export class FileType extends Model<FileType> {
  @Column({
      type: DataType.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
  })
      id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
      name: string;

  @HasMany(() => FileHub)
      fileHubs: FileHub[];

    // @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'USER' })
    // role2: string;

    //   @ApiProperty({
    //     example: 'use foul language',
    //     description: 'A reason why user became blocked',
    //   })
    //   @Column({ type: DataType.STRING, allowNull: true })
    //   banReason: string;
    //
    // @BelongsToMany(() => User)
    // roles: Role[];

    //   @HasMany(() => Post)
    //   posts: Post[];
}
