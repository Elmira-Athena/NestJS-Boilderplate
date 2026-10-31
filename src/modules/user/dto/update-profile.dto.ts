import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileInfo {
  @ApiProperty({
    type: String,
    example: 'ExampleUpdate',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Example-update@example.com',
  })
  @IsEmail()
  email: string;
}
