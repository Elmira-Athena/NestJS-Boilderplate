import { PageDto } from '@core/pagination/dto/page.dto';
import { User } from '@database/typeorm/entities';
import { AuthCredentialDto } from '@modules/auth/dto/auth-credential.dto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageMetaDto } from '@core/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@core/pagination/dto/page-option.dto';
import { UpdateProfileInfo } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .select(['users.name', 'users.id', 'users.email'])
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.page_size);

    const itemCount = await queryBuilder.getCount();
    const data = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async getMe(id: number): Promise<Partial<User>> {
    const foundUser = await this.userRepository.findOneByOrFail({ id });
    delete foundUser.password;
    return foundUser;
  }

  async createOne(data: User | AuthCredentialDto): Promise<User> {
    const isUserExisted = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (isUserExisted) {
      throw new ConflictException('User is existed');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateProfileInfo(id: number, data: UpdateProfileInfo) {
    const info = {
      id,
      ...data,
    };
    const user = await this.userRepository.save(info);
    const roleUser = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select(['role.id as id', 'role.name as name'])
      .getRawOne();
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: {
        id: roleUser.id,
        name: roleUser.name,
      },
    };
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select([
        'users.id as id',
        'users.name as name',
        'users.email as email',
        'role.name as role',
      ])
      .getRawOne();

    if (!user) throw new UnauthorizedException('User not existed');

    return user;
  }

  async findRoleIdByUserId(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select(['role.id as role'])
      .getRawOne();

    if (!user) throw new UnauthorizedException('User not existed');

    return user;
  }

  async findOne(options: Record<string, any>): Promise<User> {
    return this.userRepository.findOneBy(options);
  }

  async deleteOne(id: number) {
    return await this.userRepository.delete(id);
  }
}
