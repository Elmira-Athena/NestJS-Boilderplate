import { Product } from '@database/typeorm/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'Product 1',
            price: 200000,
          },
          {
            name: 'Product 2',
            price: 300000,
          },
          {
            name: 'Product 3',
            price: 400000,
          },
          {
            name: 'Product 4',
            price: 500000,
          },
          {
            name: 'Product 5',
            price: 600000,
          },
        ]),
      );
    }
  }
}
