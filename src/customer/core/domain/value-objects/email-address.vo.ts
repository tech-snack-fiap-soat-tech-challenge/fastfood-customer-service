import { BaseValueObject } from '@/domain/value-objects/base.value-object';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

type EmailAddressVoProps = {
  value: string;
};

export class EmailAddressVO extends BaseValueObject<EmailAddressVoProps> {
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  private constructor(props: EmailAddressVoProps) {
    super(props);
  }

  get value(): string {
    return this.getProps().value;
  }

  public static create(email: string): EmailAddressVO {
    return new EmailAddressVO({ value: email.trim() });
  }

  protected validateProps(props: EmailAddressVoProps): void {
    if (!EmailAddressVO.EMAIL_REGEX.test(props.value)) {
      throw new InvalidInputDataException('customer', 'invalid email address');
    }
  }
}
