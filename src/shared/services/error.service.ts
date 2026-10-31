import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { NodeEnv } from '@core/enum';

@Injectable()
export class ErrorService {
  constructor(
    private readonly configService: ConfigService,
  ) {}
  message(err: string | object, i18n: I18nContext, stackTrace: any) {
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(err['message'], i18n);
      case 'Forbidden':
        return this.combine(err['message'], i18n);
      case 'Internal Server Error':
        if (this.configService.get('NODE_ENV') == NodeEnv.DEVELOPMENT) {
          return this.combineDev(err['message'], i18n, stackTrace);
        }
        return this.combine(err['message'], i18n);
      case 'Not Found':
        return this.combine(err['message'], i18n);
      case 'Unauthorized':
        return this.combine(err['message'], i18n);
      case 'Unprocessable Entity':
        return this.handleUnprocessEntity(err, i18n);
      default:
        return this.combine(err['message'], i18n);
    }
  }

  private handleUnprocessEntity(error: string | object, i18n: I18nContext) {
    const transformedError = this.transform(error['message'], i18n).flat();

    return this.combine('CUS-0401', i18n, transformedError);
  }

  private transform(errors: ValidationError[], i18n: I18nContext) {
    const transformedError = errors.map((err: ValidationError) => {
      return Object.values(err.constraints).map((value: string) => {
        return Object.assign(
          i18n.t(`errors.${value}`, {
            args: { property: err.property },
          }),
          { field: err.property },
        );
      });
    });

    return transformedError;
  }

  private combine(err_msg: string, i18n: I18nContext, errors: object[] = []) {
    console.log(errors);
    return Object.assign(i18n.t(`errors.${err_msg}`), {});
  }

  private combineDev(err_msg: string, i18n: I18nContext, stackTrace: any) {
    return Object.assign(i18n.t(`errors.${err_msg}`), {
      details: stackTrace
    });
  }
}
