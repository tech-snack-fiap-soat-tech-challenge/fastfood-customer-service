import { BaseValueObject } from '@/domain/value-objects/base.value-object';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

type PhoneNumberVoProps = {
  value: string;
};

export class PhoneNumberVO extends BaseValueObject<PhoneNumberVoProps> {
  private static readonly PHONE_REGEX: RegExp = /^\d{10,11}$/;

  private constructor(props: PhoneNumberVoProps) {
    super(props);
  }

  get value(): string {
    return this.getProps().value;
  }

  public static create(phone: string): PhoneNumberVO {
    return new PhoneNumberVO({ value: phone?.trim().replace(/\D+/g, '') });
  }

  protected validateProps(props: PhoneNumberVoProps): void {
    if (!props?.value) {
      throw new InvalidInputDataException('customer', 'phone number is required');
    }

    if (!PhoneNumberVO.PHONE_REGEX.test(props.value)) {
      throw new InvalidInputDataException('customer', 'invalid phone number');
    }
  }
}
