import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  address?: string;
}
