import { PageDto } from '@core/pagination/dto/page.dto';
import { Role, User } from '@database/typeorm/entities';
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
import { USER_ROLE } from '@shared/enum/user.enum';
import { UpdateProfileUser } from '@modules/admin/dto/update-profile-user.dto';
import { UpdateProfileInfo } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
      throw new ConflictException("LO-108");
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

    if (!user) throw new UnauthorizedException('PROF-104');

    return user;
  }

  async findRoleIdByUserId(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select(['role.id as role'])
      .getRawOne();

    if (!user) throw new UnauthorizedException('PROF-104');

    return user;
  }

  async findOne(options: Record<string, any>): Promise<User> {
    return this.userRepository.findOneBy(options);
  }

  async deleteOne(id: number) {
    await this.findOneById(id);
    return await this.userRepository.delete(id);
  }

  async isAdminRole(id: number): Promise<boolean> {
    await this.findOneById(id);
    const roleID = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select(['users.role_id as role'])
      .getRawOne();

    if (roleID.role === USER_ROLE.ADMIN) {
      throw new UnauthorizedException("PROF-104");
    }

    return false;
  }

  async updateProfileUserByAdmin(id: number, data: UpdateProfileUser) {
    await this.isAdminRole(id);

    const info = {
      id: id,
      name: data.full_name,
      email: data.email,
      role_id: data.role_id,
    };

    const role = await this.roleRepository.findOne({
      where: { id: info.role_id },
    });

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        name: info.name,
        email: info.email,
        role: role,
      })
      .where('id = :id', { id: info.id })
      .execute();

    const roleUser = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'role')
      .where('users.id = :id', { id: id })
      .select([
        'users.id as id',
        'users.name as name',
        'users.email as email',
        'role.id as role_id',
        'role.name as role_name',
      ])
      .getRawOne();

    return {
      id: roleUser.id,
      full_name: roleUser.name,
      email: roleUser.email,
      role: {
        id: roleUser.role_id,
        name: roleUser.role_name,
      },
    };
  }
}
