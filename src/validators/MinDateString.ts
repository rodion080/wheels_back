import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class MinDateString implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    const moreThanThisDate = args.constraints[0];
    const valueDate = new Date(dateString);
    return moreThanThisDate < valueDate;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}