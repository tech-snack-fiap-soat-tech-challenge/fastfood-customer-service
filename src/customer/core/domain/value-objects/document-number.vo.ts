import { BaseValueObject } from '@/domain/value-objects/base.value-object';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

type DocumentNumberVoProps = {
  value: string;
};

export class DocumentNumberVo extends BaseValueObject<DocumentNumberVoProps> {
  private static readonly DOCUMENT_REGEX: RegExp = /^(?=.*^\d{11}$)(?!.*(\d)\1{10}).*$/;

  private constructor(props: DocumentNumberVoProps) {
    super(props);
  }

  get value(): string {
    return this.getProps().value;
  }

  public static create(document: string): DocumentNumberVo {
    return new DocumentNumberVo({ value: document?.trim().replace(/\D+/g, '') });
  }

  protected validateProps(props: DocumentNumberVoProps): void {
    if (!props?.value) {
      throw new InvalidInputDataException('customer', 'document number is required');
    }

    if (!DocumentNumberVo.DOCUMENT_REGEX.test(props.value)) {
      throw new InvalidInputDataException('customer', 'invalid document number');
    }

    const digits: number[] = props.value.split('').map((el) => +el);

    function getVerifyingDigit(arr: number[]): number {
      const reduced = arr.reduce((sum, digit, index) => sum + digit * (arr.length - index + 1), 0);
      return ((reduced * 10) % 11) % 10;
    }

    const verifyingDigit1 = getVerifyingDigit(digits.slice(0, 9));
    const verifyingDigit2 = getVerifyingDigit(digits.slice(0, 10));

    if (!(verifyingDigit1 === digits[9] && verifyingDigit2 === digits[10])) {
      throw new InvalidInputDataException('customer', 'invalid document number');
    }
  }
}
