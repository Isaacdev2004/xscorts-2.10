import {
  IsString, IsEmail, IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginByEmailPayload {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
