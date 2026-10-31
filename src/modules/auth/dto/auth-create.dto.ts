import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty({ message: 'RE-104' })
  @IsString()
  full_name: string;

  @IsNotEmpty({ message: 'RE-104' })
  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'RE-104' })
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty({ message: 'RE-104' })
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @IsString()
  @MinLength(6)
  confirm_password: string;
}
