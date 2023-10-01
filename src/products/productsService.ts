import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Collection } from 'src/models/entities/collection.entity';
import { User } from 'src/models/entities/user.entity';
import { AddProductRequest } from 'src/models/requests/addProductRequest';
import { Product } from 'src/models/entities/product.entity';
import { ProductResponse } from 'src/models/responses/productResponse';
import { CreateItemResponse } from 'src/models/responses/createItemResponse';

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
  imgs = [
    'https://s3-alpha-sig.figma.com/img/fc16/1173/04231127f60c018d8c3c69ed719e113f?Expires=1696809600&Signature=AerIF114jIhSpdJJOo1yrZQqtVLRZcGdBQylnDyfVRj63hIEuZTNtFIxnPe1QSSrjI-Ytq~cVoVCkyZe~AeK3p7sQr323n~Q5xSWVzOb40vzFKyfkatYAdtsilLkUqNAueqo2~XA4nJruhsrBKRc5uXSX7t7OJY5e-cKZNY5hVz-opqa-Fl0t5Sr94ATrR2K6uCx5sXZj20HMEY3YlPyTWD020dhPsEhMXkIYJSBYE5i3kvzFbTfNgDHvUN1awieanRK9H3YpNnIWoz0vRBnCWH29Og-ncduggkTcQirqCZ8Hc~H~-4Oo4SY1~380pQ7p~yoByz9IENqM3A5Jh2EIA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/67fd/59a2/6557facf246514efb5ddfd34b4fa8ad4?Expires=1696809600&Signature=U22yaDZ~kMmQPgIUNajFuHXKSjyFlMsZf3DGwBRR51JH3~~uEbMfpx4wwoaLXy~c7hKT-NMTguxcrYaTQDs1cVp~DdUp8~NruX-JJ0U3knLB~-7c9u1Iu7IvGo80tGTGH6SmPDsvsW5LOHYoHKJMrOWLLM26UC4Te0zZNIJJeOR8ZIb8JYVnW8USSnTCT7NU-1VM9Kz0fUIp6LboJt3wl1-HifEnBJ9yvhgvtmaIgERd7KEOWh2oFiIDW1R9~pRur~zX0-WSdyfdFDAySTTujJpP7bvH4HqUvc79T5eUKfuF9fj9yxZ8rPRPJvPHeWIvhG9B0v2IzQSRPQasug6HgA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/3514/7d22/38defe9455468c9dabdfc64c82755f03?Expires=1696809600&Signature=VdgjcrBF2We5EznhRi-DrP6M8CiCLmaNWagW0r5NxyC4AuKFPT0X3Bt2NgRrlVIi8sWy6ALl5glZg~3G0MOdukYW18KApE-HiyvZDGzHWg~9eyP~B1wuSzqdTGW~ztY~fjoWECYbZECOPS5bnDBNlblgisSjunix3X1wWYWJZUOQu~Ew85QPEM3x7OP0W9nTx15RxZc44Qh~Mz1Vv-YR7I~vJembrakSaiR7p2ptWDZPao2j53XZE~Cb1tDNv2vaHTZcI~x1WqowlDQGxvNw0i4-g9sB13D9fXfNiVJ19Uxuu-rPtMFoc3la9bbjmpVp~EbQeXKdadUeoJaJ2cPfgQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/380e/f934/040f4c04f1e0632eb5aea70b82eccda3?Expires=1696809600&Signature=Y87hSE9m9fnZO2vPFWXKaQjqr92x2j85jGKe9grkMxw1HEI3k~UnY5dITdebLN8aeVapvFnh00Z98tJh4NZn2oLX3aBGmKllgvAOVozCXfAQ9D8J75fy3LplmVFbda8oyxXxsStd2St~jzypXknNg6YgCbaqVi2-pM5fXMHTmoorWVK125iHuZ16u7GVzJgouzlxJVs0v4iiT73Q60RHN3AvjbkYP6t~WfnhzPwfIGYrdVPyYq2rB63VD7WxMCxJ0q-LQMMhHg4Ew8ZCHWi5rDDhzFHNi7hoUS1l1WQdEaNE1TJv2FD4DjwIl5drbrR7IwUaSUEjA9-ud4icERj5WA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/4f29/ba0a/6c8fb109b3276ac3ee971e4a73ef0b90?Expires=1696809600&Signature=NFRkQYsqnj3dpZfiAcmq4aIL0Vw4v1WBcAWKnJjOmrGVLRY6u~xFI7GgSU1joI2NnZwDZK~lOIZru9BdEQ38RNxjiO0avO1TtL0qYirXr9UZ0NkrKNhcDPRgKZWDuYc-EBNsIpjG2QOXKiCXVoZJVqZ5TvEzz5juI8sFP~JuUxmdpcc~8uZIMD818iHkKzLJR1W74gtk6sTP74mo1XodfX2MgTdPX2ajt-Ph57iELyIqceQaj71BRYmNJ6NMxG4uR0fhDIt5PdvgPErz4orR9kX5GNRA77-tlnhyPFxRbPbccMwILmypzM9vbNNe94TWK3hoz7eY4dTS3GGZ1Z4Qgw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
  ];

  async add(
    request: AddProductRequest,
    userId: number,
  ): Promise<CreateItemResponse> {
    const index = Math.floor(Math.random() * 3);
    request.img = this.imgs[index];

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

    return { id: result.raw[0].id };
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
