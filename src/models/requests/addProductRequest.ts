import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Collection } from '../entities/collection.entity';

export class AddProductRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  img: string;

  @ApiProperty()
  collectionId: number;

  static mapToEntity(
    request: AddProductRequest,
    user: User,
    collection: Collection,
  ): Product {
    return {
      name: request.name,
      price: request.price,
      img: request.img,
      user: user,
      collection: collection,
    };
  }
}
