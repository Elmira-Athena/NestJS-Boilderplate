import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsString()
  @MinLength(6)
  confirm_password: string;
}
