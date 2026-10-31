import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileInfo {
  @ApiProperty({
    type: String,
    example: 'ExampleUpdate',
  })
  @IsNotEmpty({ message: 'FIELD-0001-NAME' })
  @IsString()
  full_name: string;

  @IsNotEmpty({ message: 'FIELD-0001-EMAIL' })
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'Example-update@example.com',
  })
  email: string;
}
