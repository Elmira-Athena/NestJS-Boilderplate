import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  class CorrectPasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
      if (typeof password !== 'string') {
        return false;
      }
      const lengthValid = password.length >= 7 && password.length <= 50;
      const hasDigit = /\d/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
  
      return lengthValid && hasDigit && hasUppercase;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'FIELD-0001-PW';
    }
  }
  
  export function CorrectPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: CorrectPasswordConstraint,
      });
    };
  }
  