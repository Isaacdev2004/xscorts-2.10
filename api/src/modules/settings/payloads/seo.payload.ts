import {
  IsString,
  IsOptional,
  IsNotEmpty
} from 'class-validator';

export class SeoCreatePayload {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  metaKeywords: string;

  @IsString()
  @IsOptional()
  metaDescription: string;

  @IsString()
  @IsOptional()
  metaTitle: string;

  @IsString()
  @IsOptional()
  canonicalUrl: string;
}

export class SeoUpdatePayload extends SeoCreatePayload {}
