export class FileDto {
  readonly uuid: string;
  readonly name: string;
  readonly path: string;
  readonly mime: string;
  readonly ext: string;
  readonly hubId?: number;
}
