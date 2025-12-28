import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString,
  ValidateIf
} from 'class-validator';
import { SearchRequest } from 'src/kernel';
import { ABUSE_REPORT_CATEGORY_LIST } from '../constant';

export class PerformerAbuseReportPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @ApiProperty()
  @IsOptional()
  @IsIn(ABUSE_REPORT_CATEGORY_LIST)
  @IsString()
  category: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;
}

export class PerformerAbuseReportSearchPayload extends SearchRequest {
  @IsOptional()
  @IsIn(ABUSE_REPORT_CATEGORY_LIST)
  @IsString()
  @ValidateIf((o) => !!o.category)
  category?: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  @ValidateIf((o) => !!o.targetId)
  targetId: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  @ValidateIf((o) => !!o.sourceId)
  sourceId: string;
}
