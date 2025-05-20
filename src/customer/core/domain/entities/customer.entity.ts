import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/domain/entities/base.entity';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';
import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

type TCustomerEntityProps = Partial<BaseEntity> & {
  name: string;
  email: EmailAddressVO;
  phone: PhoneNumberVO;
  document: DocumentNumberVo;
};

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  private static readonly requiredFields = ['name', 'email', 'phone', 'document'];

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    transformer: {
      from: (v: string): EmailAddressVO => EmailAddressVO.create(v),
      to: (vo: EmailAddressVO): string => vo.value,
    },
  })
  email: EmailAddressVO;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 13,
    transformer: {
      from: (v: string): PhoneNumberVO => PhoneNumberVO.create(v),
      to: (vo: PhoneNumberVO): string => vo.value,
    },
  })
  phone: PhoneNumberVO;

  @Column({
    name: 'document',
    type: 'varchar',
    length: 13,
    transformer: {
      from: (v: string): DocumentNumberVo => DocumentNumberVo.create(v),
      to: (vo: DocumentNumberVo): string => vo.value,
    },
  })
  document: DocumentNumberVo;

  private constructor(props: TCustomerEntityProps) {
    super(props);
    Object.assign(this, props);
  }

  public static create(props: TCustomerEntityProps): CustomerEntity {
    props.name = props.name?.trim();

    this.requiredFields.forEach((key) => {
      if (!props[key as keyof TCustomerEntityProps]) {
        throw new InvalidInputDataException('customer', `${key} is required`);
      }
    });

    return new CustomerEntity(props);
  }
}
