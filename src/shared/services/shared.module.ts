import { Global, Module, Provider } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import { ErrorService } from './error.service';

const providers: Provider[] = [ApiConfigService, ErrorService];

@Global()
@Module({
  providers,
  imports: [],
  exports: providers,
})
export class SharedModule {}
