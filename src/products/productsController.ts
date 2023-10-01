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
import { ProductsService } from './productsService';
import { Response } from 'express';
import { ProductResponse } from 'src/models/responses/productResponse';
import { AddProductRequest } from 'src/models/requests/addProductRequest';
import { CreateItemResponse } from 'src/models/responses/createItemResponse';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async add(
    @Body() request: AddProductRequest,
    @Request() req,
    @Res() res: Response<CreateItemResponse>,
  ) {
    try {
      res
        .status(HttpStatus.CREATED)
        .send(await this.productsService.add(request, req.user.sub));
    } catch (ex) {
      res.status(HttpStatus.CONFLICT).send();
    }
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response<ProductResponse>,
  ) {
    const result = await this.productsService.getById(id);

    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      res.status(HttpStatus.NOT_FOUND).json();
    }
  }

  @Get()
  async getProducts(@Res() res: Response<ProductResponse[]>) {
    res.status(HttpStatus.OK).json(await this.productsService.getProducts());
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('created/:userId')
  async getOwnedProducts(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response<ProductResponse[]>,
  ) {
    res
      .status(HttpStatus.OK)
      .json(await this.productsService.getByUserId(userId));
  }
}
