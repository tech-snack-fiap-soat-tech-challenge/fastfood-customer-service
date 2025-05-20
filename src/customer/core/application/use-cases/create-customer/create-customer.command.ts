import { CustomerInput } from '@/application/dtos/customer.input';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

export class CreateCustomerCommand {
  public readonly customer: CustomerInput;

  constructor(input: CustomerInput) {
    this.customer = input;
  }

  toEntity(): CustomerEntity {
    return CustomerEntity.create({
      ...this.customer,
      email: EmailAddressVO.create(this.customer.email),
      phone: PhoneNumberVO.create(this.customer.phone),
      document: DocumentNumberVo.create(this.customer.document),
    });
  }
}
