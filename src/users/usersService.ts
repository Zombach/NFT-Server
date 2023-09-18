import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserRequest } from 'src/models/requests/registerUserRequest';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponse } from 'src/models/responses/userResponse';
import { AuthService } from 'src/auth/authService';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_REPOSITORY') private usersRepository: Repository<User>) {}

  async register(request: RegisterUserRequest): Promise<number> {
    const user: User = {
      name: request.name,
      email: request.email,
      address: request.address,
      description: 'Подумать нужно ли оставлять это поле!',
      password: await AuthService.getPasswordHash(request.password),
      avatar: './',
      collections: [],
      products: [],
      orders: [],
    };

    return await this.add(user);
  }

  async add(user: User): Promise<number> {
    const result = await this.usersRepository.createQueryBuilder('users').insert().values([user]).execute();

    return result.raw;
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.usersRepository.createQueryBuilder('users').where('users.id = :id', { id: id }).getOne();

    return UserResponse.mapFromEntity(user);
  }
}
