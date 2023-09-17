import { ApiProperty } from '@nestjs/swagger';

export class SignInRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
