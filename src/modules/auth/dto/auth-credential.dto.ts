import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @ApiProperty({
    type: String,
    example: 'Example@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Test12345'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
