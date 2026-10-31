import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import momoGatewayConfig from '../../../config/momo.config';
import { MomoService } from './momo.service';
import { CodService } from './cod.service';
import { PaymentFactory } from './payment.factory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@database/typeorm/entities/order.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order]),
    ConfigModule.forRoot({
      load: [momoGatewayConfig],
    }),
  ],
  controllers: [],
  providers: [MomoService, CodService, PaymentFactory],
  exports: [MomoService, CodService, PaymentFactory],
})
export class FactoryModule {}
