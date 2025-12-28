import {
  IsString, IsNotEmpty, IsOptional,
  Validate
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Password } from 'src/modules/user/validators';

export class PasswordChangePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  source = 'user';

  @ApiProperty()
  @IsOptional()
  @IsString()
  type = 'email';

  @IsString()
  @Validate(Password)
  @IsNotEmpty()
  password: string;
}

export class PasswordUserChangePayload {
  @ApiProperty()
  @IsOptional()
  @IsString()
  type = 'email';

  @ApiProperty()
  @IsOptional()
  @IsString()
  source: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  @Validate(Password)
  @IsNotEmpty()
  password: string;
}
