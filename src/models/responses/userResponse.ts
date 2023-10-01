import { User } from '../entities/user.entity';

export class UserResponse {
  id: number;
  name: string;
  email: string;
  description?: string;
  avatar?: string;
  address?: string;

  static mapFromEntity(entity: User): UserResponse {
    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      description: entity.description,
      avatar: entity.avatar,
      address: '0xa6794dec66df7d8b69752956df1b28ca93f77cd7',
    };
  }
}
