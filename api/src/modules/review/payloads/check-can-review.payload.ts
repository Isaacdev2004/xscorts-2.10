import {
  IsMongoId,
  IsNotEmpty,
  IsString
} from 'class-validator';

export class CheckCanReviewPayload {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  performerId: string;
}
