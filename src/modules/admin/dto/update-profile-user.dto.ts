import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProfileUser {
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
    type: Number,
    example: '1',
  })
  @IsNumber()
  role_id: number;
}
