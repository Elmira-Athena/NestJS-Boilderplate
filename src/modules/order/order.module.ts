import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import momoGatewayConfig from '../../config/momo.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from '@database/typeorm/entities/payment-method.entity';
import { FactoryModule } from './factories/factory.module';
import { JwtService } from '@nestjs/jwt';
import { Order } from '@database/typeorm/entities/order.entity';

@Module({
  imports: [
    FactoryModule,
    TypeOrmModule.forFeature([PaymentMethod, Order]),
    ConfigModule.forRoot({
      load: [momoGatewayConfig],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
