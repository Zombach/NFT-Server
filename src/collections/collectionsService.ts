import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Collection } from 'src/models/entities/collection.entity';
import { CollectionResponse } from 'src/models/responses/collectionResponse';
import { AddCollectionRequest } from 'src/models/requests/addCollectionRequest';
import { User } from 'src/models/entities/user.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @Inject('COLLECTIONS_REPOSITORY')
    private collectionsRepository: Repository<Collection>,
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async add(request: AddCollectionRequest, userId: number): Promise<number> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: userId })
      .getOne();

    const entity = AddCollectionRequest.mapToEntity(request, user);

    const result = await this.collectionsRepository
      .createQueryBuilder('collections')
      .insert()
      .values([entity])
      .execute();

    return result.raw;
  }

  async getById(id: number): Promise<CollectionResponse> {
    const collection = await this.collectionsRepository
      .createQueryBuilder('collections')
      .where('collections.id = :id', { id: id })
      .leftJoinAndSelect('collections.user', 'user')
      .getOne();

    return CollectionResponse.mapFromEntity(collection);
  }

  async getByUserId(userId: number): Promise<CollectionResponse[]> {
    const collections = await this.collectionsRepository
      .createQueryBuilder('collections')
      .where('collections.user.id = :userId', { userId: userId })
      .leftJoinAndSelect('collections.user', 'user')
      .getMany();

    return collections.map((c) => CollectionResponse.mapFromEntity(c));
  }
}
