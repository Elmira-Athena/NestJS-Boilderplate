import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@database/typeorm/entities';
import { Repository } from 'typeorm';
import { USER_ROLE } from '@shared/enum/user.enum';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'user 1',
            email: 'user1@gmail.com',
            password: '123456Abc#',
            role: {
              id: USER_ROLE.MEMBER,
            },
          },
          {
            name: 'user 2',
            email: 'user2@gmail.com',
            password: '123456Abc#',
            role: {
              id: USER_ROLE.MEMBER,
            },
          },
          {
            name: 'admin',
            email: 'admin@gmail.com',
            password: '123456Abc#',
            role: {
              id: USER_ROLE.ADMIN,
            },
          },
        ]),
      );
    }
  }
}
