import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInRequest } from 'src/models/requests/signInRequest';
import { AuthService } from './authService';
import { JwtResponse } from 'src/models/responses/jwtResponse';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() request: SignInRequest): Promise<JwtResponse> {
    return await this.authService.signIn(request.email, request.password);
  }
}
