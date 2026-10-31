import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import * as argon2 from 'argon2';
import { USER_ROLE } from '@shared/enum/user.enum';

@Index('users_email_key', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', length: 255 })
  name: string;

  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('character varying', { name: 'password', length: 255 })
  password: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;

  @BeforeInsert()
  setDefaultRole() {
    if (!this.role) {
      this.role = new Role();
      this.role.id = USER_ROLE.MEMBER;
    }
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @BeforeUpdate()
  async updatePassword() {
    this.password = await argon2.hash(this.password);
  }
}
