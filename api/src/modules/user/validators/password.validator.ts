import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'password', async: false })
export class Password implements ValidatorConstraintInterface {
  validate(text: string) {
    if (!text) {
      return false;
    }

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(text);
  }

  defaultMessage() {
    return '($value) is invaid password!';
  }
}
