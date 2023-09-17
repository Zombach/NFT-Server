import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/authGuard';
import { CollectionsService } from './collectionsService';
import { AddCollectionRequest } from 'src/models/requests/addCollectionRequest';
import { Response } from 'express';
import { CollectionResponse } from 'src/models/responses/collectionResponse';

@ApiTags('collections')
@ApiBearerAuth('JWT-auth')
@Controller('api/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async add(
    @Body() request: AddCollectionRequest,
    @Request() req,
    @Res() res: Response<number>,
  ) {
    res
      .status(HttpStatus.CREATED)
      .send(await this.collectionsService.add(request, req.user.sub));
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<CollectionResponse>,
  ) {
    const result = await this.collectionsService.getById(id);

    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.NOT_FOUND).json();
    }
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('created/:userId')
  async getOwnedCollections(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response<CollectionResponse[]>,
  ) {
    res
      .status(HttpStatus.OK)
      .json(await this.collectionsService.getByUserId(userId));
  }
}
