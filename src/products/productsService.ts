import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Collection } from 'src/models/entities/collection.entity';
import { User } from 'src/models/entities/user.entity';
import { AddProductRequest } from 'src/models/requests/addProductRequest';
import { Product } from 'src/models/entities/product.entity';
import { ProductResponse } from 'src/models/responses/productResponse';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_REPOSITORY')
    private productsRepository: Repository<Product>,
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
    @Inject('COLLECTIONS_REPOSITORY')
    private collectionsRepository: Repository<Collection>,
  ) {}

  async add(request: AddProductRequest, userId: number): Promise<number> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: userId })
      .getOne();

    const collection = await this.collectionsRepository
      .createQueryBuilder('collections')
      .where('collections.id = :id', { id: request.collectionId })
      .getOne();

    if (!collection) {
      throw new ConflictException();
    }

    const entity = AddProductRequest.mapToEntity(request, user, collection);

    const result = await this.productsRepository
      .createQueryBuilder('products')
      .insert()
      .values([entity])
      .execute();

    return result.raw;
  }

  async getById(id: number): Promise<ProductResponse> {
    const collection = await this.productsRepository
      .createQueryBuilder('products')
      .where('products.id = :id', { id: id })
      .leftJoinAndSelect('products.user', 'user')
      .getOne();

    return ProductResponse.mapFromEntity(collection);
  }

  async getByUserId(userId: number): Promise<ProductResponse[]> {
    const collections = await this.productsRepository
      .createQueryBuilder('products')
      .where('products.user.id = :userId', { userId: userId })
      .leftJoinAndSelect('products.user', 'user')
      .getMany();

    return collections.map((c) => ProductResponse.mapFromEntity(c));
  }

  async getProducts(): Promise<ProductResponse[]> {
    const collections = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.user', 'user')
      .getMany();

    return collections.map((c) => ProductResponse.mapFromEntity(c));
  }
}
