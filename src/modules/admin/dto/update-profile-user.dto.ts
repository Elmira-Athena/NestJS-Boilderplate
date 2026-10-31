import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProfileUser {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty({ message: 'FIELD-0001-NAME' })
  @IsString()
  full_name: string;

  @IsNotEmpty({ message: 'FIELD-0001-EMAIL' })
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  email: string;
}
