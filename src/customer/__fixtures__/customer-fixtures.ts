import { CustomerEntity } from '@/domain/entities/customer.entity';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

export const currentCustomerRaw = {
  id: 123,
  name: 'John Doe',
  phone: '(12) 9 1234-5678',
  email: 'john.doe@example.com',
  document: '388.697.710-24',
  createdAt: new Date('2024-05-05T10:10:00.000Z'),
  updatedAt: new Date('2024-05-05T10:10:00.000Z'),
  deletedAt: undefined,
};

export const anotherCustomerRaw = {
  id: 456,
  name: 'Jane Doe',
  phone: '(12) 9 8765-4321',
  email: 'jane.doe@example.com',
  document: '833.109.140-03',
  createdAt: new Date('2024-05-05T10:10:00.000Z'),
  updatedAt: new Date('2024-05-05T10:10:00.000Z'),
  deletedAt: undefined,
};

export const currentCustomerEntity = CustomerEntity.create({
  name: currentCustomerRaw.name,
  phone: PhoneNumberVO.create(currentCustomerRaw.phone),
  email: EmailAddressVO.create(currentCustomerRaw.email),
  document: DocumentNumberVo.create(currentCustomerRaw.document),
});

export const anotherCustomerEntity = CustomerEntity.create({
  name: anotherCustomerRaw.name,
  phone: PhoneNumberVO.create(anotherCustomerRaw.phone),
  email: EmailAddressVO.create(anotherCustomerRaw.email),
  document: DocumentNumberVo.create(anotherCustomerRaw.document),
});

export const customerValueObjectsFixtures = {
  phoneNumber: {
    valid: {
      landlinePhone: '1632662454',
      landlinePhoneWithFormatting: '(16) 3266-2454',
      mobilePhone: '88998867932',
      mobilePhoneWithFormatting: '(88) 9 9886-7932',
    },
    invalid: {
      tooShortNumber: '123',
      tooLongNumber: '1234567891234567890',
      specialCharacters: '+12345abcde',
    },
  },
  documentNumber: {
    valid: {
      digitsOnly: '52998224725',
      withFormatting: '529.982.247-25',
      withSpaces: '529 982 247 25',
      alternativeDigitsOnly: '68892403087',
      alternativeWithFormatting: '688.924.030-87',
    },
    invalid: {
      empty: '',
      tooShort: '5299822472',
      tooLong: '529982247250',
      allSameDigits: '11111111111',
      wrongCheckDigits: '52998224722',
      specialCharacters: 'abcd5299822',
      withLetters: '5299822472X',
    },
  },
  emailAddress: {
    valid: {
      withRegularText: 'user@domain.com',
      withAlias: 'user+orders@domain.com',
      withHyphens: 'user-name@domain-name.com',
      withNumbers: 'user123@domain.com',
      withDots: 'first.last@domain.com',
      withMultipleDots: 'user.name@sub.domain.com',
    },
    invalid: {
      empty: '',
      missingAt: 'user-domain.com',
      missingDomainPart: 'user@',
      missingLocalPart: '@domain.com',
      missingTld: 'user@domain',
      withSpaces: 'user name@domain.com',
      multipleAt: 'user@domain@test.com',
    },
  },
};
