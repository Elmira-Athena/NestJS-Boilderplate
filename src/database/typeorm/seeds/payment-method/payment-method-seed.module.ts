import { PaymentMethod } from '@database/typeorm/entities/payment-method.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodSeedService } from './payment-method-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodSeedService],
  exports: [PaymentMethodSeedService],
})
export class PaymentMethodSeedModule {}
