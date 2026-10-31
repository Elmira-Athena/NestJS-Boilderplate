import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { SeedModule } from './seed.module';
import { PaymentMethodSeedService } from './payment-method/payment-method-seed.service';
import { ProductSeedService } from './product/products-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();

  await app.get(UserSeedService).run();

  await app.get(PaymentMethodSeedService).run();

  await app.get(ProductSeedService).run();

  await app.close();
};

void runSeed();
