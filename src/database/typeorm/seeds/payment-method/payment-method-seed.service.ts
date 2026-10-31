import { PaymentMethod } from '@database/typeorm/entities/payment-method.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodSeedService {
  constructor(
    @InjectRepository(PaymentMethod)
    private repository: Repository<PaymentMethod>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        this.repository.create([
          {
            name: 'COD',
          },
          {
            name: 'Momo',
          },
          {
            name: 'VnPay',
          },
        ]),
      );
    }
  }
}
