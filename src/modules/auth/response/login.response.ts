import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'eyjdqoidjoqjdoi',
  })
  token: string;
}
