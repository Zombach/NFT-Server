import { User } from '../entities/user.entity';

export class UserResponse {
  id: number;
  name: string;
  email: string;
  description?: string;
  avatar?: string;

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
    };
  }
}
