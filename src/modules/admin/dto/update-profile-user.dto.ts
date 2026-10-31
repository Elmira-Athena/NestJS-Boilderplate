import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProfileUser {
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
    type: Number,
    example: '1',
  })
  @IsNumber()
  role_id: number;
}
