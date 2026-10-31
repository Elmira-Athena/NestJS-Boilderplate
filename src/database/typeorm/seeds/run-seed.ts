import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();

  await app.get(UserSeedService).run();

  await app.close();
};

void runSeed();
