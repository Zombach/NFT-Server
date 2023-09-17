import { Collection } from '../entities/collection.entity';
import { User } from '../entities/user.entity';

export class CollectionResponse {
  id: number;
  name: string;
  desc?: string;
  creator: CollectionCreatorResponse;

  static mapFromEntity(entity: Collection): CollectionResponse {
    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      creator: CollectionCreatorResponse.mapFromEntity(entity.user),
      desc: entity.desc,
    };
  }
}

export class CollectionCreatorResponse {
  id: number;
  email: string;
  address: string;
  avatar: string;

  static mapFromEntity(entity: User): CollectionCreatorResponse {
    return {
      id: entity.id,
      email: entity.email,
      address: entity.address,
      avatar: entity.avatar,
    };
  }
}
