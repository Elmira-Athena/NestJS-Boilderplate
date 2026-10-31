import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSeedService } from './products-seed.service';
import { Product } from '@database/typeorm/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
