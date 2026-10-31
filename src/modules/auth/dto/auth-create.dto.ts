import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchingPassword } from '@shared/decorator/matching-passwork.decorator';
import { CorrectPassword } from '@shared/decorator/correct-password.decorator';

export class CreateAuthDto {
  @ApiProperty({
    type: String,
    example: 'Example',
  })
  @IsNotEmpty({ message: 'FIELD-0001-NAME' })
  full_name: string;

  @IsNotEmpty({ message: 'FIELD-0001-EMAIL' })
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'Example@example.com',
  })
  email: string;

  @CorrectPassword()
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  password: string;

  @CorrectPassword()
  @ApiProperty({
    type: String,
    example: 'Test12345',
  })
  @MatchingPassword('password', { message: 'RE-MATCHING-PW' })
  confirm_password: string;
}
