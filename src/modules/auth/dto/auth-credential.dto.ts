import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'LO-104' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsString()
  @IsNotEmpty({ message: 'LO-104' })
  @MinLength(6)
  password?: string;
}
