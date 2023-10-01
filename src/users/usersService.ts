import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserRequest } from 'src/models/requests/registerUserRequest';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponse } from 'src/models/responses/userResponse';
import { AuthService } from 'src/auth/authService';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: Repository<User>,
  ) {}

  imgs = [
    'https://s3-alpha-sig.figma.com/img/905e/93ac/0198d709a21362bee8cea7a1dc615a56?Expires=1696809600&Signature=DPRL3st0sGKXDbpzvjF~QXZ5lmOM9xMvQ159Vvi9eXRlvFpjTXcAC89ArxUp7L-l~cdgKPBUFSLdFhw7WEzefeXKEPaoTkpICHGKcNYZ8eai3zNfoEuniaH~SsQukIPWYSqA-6RfYXUFUk39swqCkOP5B-5bJzarg-0SxGaIk1L4p7XtRbb2rzjO4RNGbcacIyi0bXcf7ySldWrvycgJpLnDkz9iXCl0Si-eJAMtW0zysXz3lRjvQ2BJZ9nmOZ0R0GogNvJe2MPUAf~pQZiw0HtpIatWOeMD4PK48o9TDw5KZtLs~ZAvS4Zne7QKqAIrPN8pMdoVj0SEIRIIKFM79Q__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/3975/0a99/5f4d00d938fb91dd428f763ddc1150a6?Expires=1696809600&Signature=jyQ6FblBIC9g1dlElVMfNt~XhslYfojXka~yoLrP7AcG032~bzlxqjsYk24U59Jyp~swiiQFzQZeJ5urDxXK0zS2qLPYwY1Rl2-TAD1FhXtOJ2JaUdFdhPPXtEg~BbkJ~tOBoj9j3oeiBpemkKIh22ayhdbUCy-xlYPQqr2gPJHVpk~Dpv-knFLv~jq1o77BLjqgE-yXmXgMEzpdlR-NFpWUlEU4huX3tZfcNPe65sSuJnjhG3ApXQ2y-iExTjPRSGhFSF~nTIq6dRILlG18DFA1SPmq9saRsu3nf2VrZqhKQ7NND-BstE0~QIhBPr68WNApwe1~kNSuzLdQgjm1ZA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/b3cc/1379/ddd848d5e24f5274cc41dd12f9f737cb?Expires=1696809600&Signature=Eehik7abrr42YuGskTuI4SQW1XtaodiK1epGtRq01~LpxpOsZsfz0g9uyjgTQi~NkRG1jnOaSYvSnqjkRyz1m4or-mHWTCQurCisrOxD5uxYy02vAXJeK9Ba-YJZe659yzdfJSdwFF1kxLZ7qKf-tIze00S~pTHJC~XdjQmpIuDXt1N6D0LoT7N5SObZ1xxYNzI76oRonlGe97O0BsU3BSAOvoqGhS0aFEnfcySbiFoNfHY54o~WfpSOutvAgw1Tp4UVkhujA56dkiHDLCMq6~qJEkLOUJfYTEdJ9794Pwi6y0wf3uhs9pFD3pot8P-X9MwzaU-Ej-Fb542C95xaxw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    'https://s3-alpha-sig.figma.com/img/28a9/a9e8/29703db155142db08835a36b6f7927e6?Expires=1696809600&Signature=bc4EGUDJz3cz5FFIjHmZ6az6wkNCv2ESNXzQ87fguciwgtkjK5f9B4wndJvm0wTCBQsu-fyp3QFlHmNxzajCTDNu~3g8Q0HoQalxY1P0tlbNPBr1AlrF2MlO9-kdIhRnn7~No5pYzKwmFMlYPraTcMS5Sihl~tYm3QzTe7XAca1a-dRXtJYiYTZFZzZsf6ybY70fizZA7tiHyMff44OIoyTXtQFyx-arA4Sil2YUZdorL3zYD8tqKZpe53hGPRIxCmRCPcCRMNoXAd30vVwyCR-aWQeYnLcCDY6-0K5fmjJEQ6LW8kooTh3lD68ZjYo~aMxZdb62YDaEQnmsX-CkKQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
  ];

  async register(request: RegisterUserRequest): Promise<number> {
    const index = Math.floor(Math.random() * 3);
    const user: User = {
      name: request.name,
      email: request.email,
      address: request.address,
      description: 'Подумать нужно ли оставлять это поле!',
      password: await AuthService.getPasswordHash(request.password),
      avatar: this.imgs[index],
      collections: [],
      products: [],
      orders: [],
    };

    return await this.add(user);
  }

  async add(user: User): Promise<number> {
    const result = await this.usersRepository
      .createQueryBuilder('users')
      .insert()
      .values([user])
      .execute();

    return result.raw;
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .getOne();

    return UserResponse.mapFromEntity(user);
  }

  async getAll(): Promise<UserResponse[]> {
    const users = await this.usersRepository
      .createQueryBuilder('users')
      .getMany();

    return users.map((c) => UserResponse.mapFromEntity(c));
  }
}
