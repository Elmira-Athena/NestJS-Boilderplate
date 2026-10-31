import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { validCurrencyCodes } from '@core/constant';
  
  @ValidatorConstraint({ async: false })
  class IsCurrencyConstraint implements ValidatorConstraintInterface {
    validate(currency: any, args: ValidationArguments) {
      if (typeof currency !== 'string') {
        return false;
      }
  
      // Convert currency code to uppercase to make the validation case-insensitive
      const upperCaseCurrency = currency.toUpperCase();
      return validCurrencyCodes.includes(upperCaseCurrency);
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'CUR-0001';
    }
  }
  
  export function IsCurrencyValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsCurrencyConstraint,
      });
    };
  }
  