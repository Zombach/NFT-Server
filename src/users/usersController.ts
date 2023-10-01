import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RegisterUserRequest } from 'src/models/requests/registerUserRequest';
import { UsersService } from './usersService';
import { AuthGuard } from 'src/auth/authGuard';
import { Response } from 'express';
import { UserResponse } from 'src/models/responses/userResponse';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async registerUser(
    @Body() request: RegisterUserRequest,
    @Res() res: Response<number>,
  ) {
    res
      .status(HttpStatus.CREATED)
      .send(await this.usersService.register(request));
  }

  @Get('/current')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req, @Res() res: Response<UserResponse>) {
    res
      .status(HttpStatus.OK)
      .json(await this.usersService.getUserById(req.user.sub));
  }

  @Get()
  async getAll(@Res() res: Response<UserResponse[]>) {
    res.status(HttpStatus.OK).json(await this.usersService.getAll());
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<UserResponse>,
  ) {
    const result = await this.usersService.getUserById(id);

    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.NOT_FOUND).json();
    }
  }
}
