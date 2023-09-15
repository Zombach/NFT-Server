import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '../entities/collection.entity';
import { User } from '../entities/user.entity';

export class AddCollectionRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  desc?: string;

  static mapToEntity(request: AddCollectionRequest, user: User): Collection {
    return {
      name: request.name,
      desc: request.desc,
      user: user,
      products: [],
    };
  }
}
