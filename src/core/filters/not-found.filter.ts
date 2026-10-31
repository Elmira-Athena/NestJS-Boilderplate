import { NodeEnv } from '@core/enum';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '@shared/services/error.service';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { ProjectLogger } from '@core/loggers';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  logger = new ProjectLogger('GlobalExceptionsFilter');

  constructor(
    private readonly errorService: ErrorService,
    private readonly configService: ConfigService,
  ) {}

  async catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errors = exception.getResponse();
    const i18n = I18nContext.current(host);
    const stackTrace = exception.stack;

    if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
      this.logger.info(exception.message);
    } else {
      this.logger.exception(exception.stack);
    }

    res.status(status).json(this.errorService.message(errors, i18n, stackTrace));
  }
}
