import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
