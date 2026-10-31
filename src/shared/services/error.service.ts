import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ErrorService {
  message(err: string | object, i18n: I18nContext) {
    switch (err['error']) {
      case 'Bad Request':
        return this.combine(err['message'][0], i18n);
      case 'Forbidden':
        return this.combine(err['message'], i18n);
      case 'Internal Server Error':
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
    return Object.assign(i18n.t(`errors.${err_msg}`), {});
  }
}
