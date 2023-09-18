import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { JwtResponse } from 'src/models/responses/jwtResponse';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<JwtResponse> {
    const user = await this.usersRepository.createQueryBuilder('users').where('users.email = :email', { email: email }).getOne();

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  static async getPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
