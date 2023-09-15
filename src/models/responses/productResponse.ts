import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

export class ProductResponse {
  id: number;
  name: string;
  price: number;
  img: string;
  creator: ProductCreatorResponse;

  static mapFromEntity(entity: Product): ProductResponse {
    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      img: entity.img,
      creator: ProductCreatorResponse.mapFromEntity(entity.user),
    };
  }
}

export class ProductCreatorResponse {
  id: number;
  email: string;
  avatar: string;

  static mapFromEntity(entity: User): ProductCreatorResponse {
    return {
      id: entity.id,
      email: entity.email,
      avatar: entity.avatar,
    };
  }
}
