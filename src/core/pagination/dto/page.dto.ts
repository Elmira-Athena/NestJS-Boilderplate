import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  @ApiProperty({ type: () => PageMetaDto })
  readonly total: number;

  constructor(data: T[], meta: PageMetaDto) {
    this.total = meta.itemCount;
    this.data = data;
  }
}
