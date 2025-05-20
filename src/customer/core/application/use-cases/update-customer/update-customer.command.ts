import { CustomerInput } from '@/application/dtos/customer.input';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

export class UpdateCustomerCommand {
  public readonly id: number;

  public readonly customer: CustomerInput;

  constructor(id: number, input: CustomerInput) {
    this.id = id;
    this.customer = input;
  }

  toEntity(): CustomerEntity {
    return CustomerEntity.create({
      ...this.customer,
      id: this.id,
      email: EmailAddressVO.create(this.customer.email),
      phone: PhoneNumberVO.create(this.customer.phone),
      document: DocumentNumberVo.create(this.customer.document),
    });
  }
}
