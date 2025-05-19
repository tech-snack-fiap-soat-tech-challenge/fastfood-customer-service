import { currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { PhoneNumberVO } from '@/domain/value-objects/phone-number.vo';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

describe('CustomerEntity', () => {
  // Fixtures & Stubs
  const createCustomerAllProps = {
    id: currentCustomerRaw.id,
    name: currentCustomerRaw.name,
    phone: PhoneNumberVO.create(currentCustomerRaw.phone),
    email: EmailAddressVO.create(currentCustomerRaw.email),
    document: DocumentNumberVo.create(currentCustomerRaw.document),
    createdAt: currentCustomerRaw.createdAt,
    updatedAt: currentCustomerRaw.updatedAt,
  };
  const createCustomerPartialProps = {
    name: currentCustomerRaw.name,
    phone: PhoneNumberVO.create(currentCustomerRaw.phone),
    email: EmailAddressVO.create(currentCustomerRaw.email),
    document: DocumentNumberVo.create(currentCustomerRaw.document),
  };
  const customerBaseEntityIdStub = 789;
  const customerBaseEntityDatesStub = new Date('2024-04-15T14:36:57.000Z');

  const fieldsWithInvalidValues = {
    name: ['', null, undefined],
    phone: ['', null, undefined],
    email: ['', null, undefined],
    document: ['', null, undefined],
  };

  beforeAll(() => {
    jest.spyOn(BaseEntity.prototype, 'generateNewId').mockImplementation(() => customerBaseEntityIdStub);
    jest.spyOn(BaseEntity.prototype, 'generateNewDate').mockImplementation(() => customerBaseEntityDatesStub);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Given the attempts to create a CustomerEntity', () => {
    describe('When valid values are provided', () => {
      describe('And only required fields are specified', () => {
        it('Should create a customer with default values for non-specified fields', () => {
          const customer = CustomerEntity.create(createCustomerPartialProps) as CustomerEntity;

          expect(customer).toBeInstanceOf(CustomerEntity);
          expect(customer.id).toBe(customerBaseEntityIdStub);
          expect(customer.name).toBe(createCustomerPartialProps.name);
          expect(customer.phone).toBe(createCustomerPartialProps.phone);
          expect(customer.email).toBe(createCustomerPartialProps.email);
          expect(customer.document).toBe(createCustomerPartialProps.document);
          expect(customer.createdAt).toEqual(customerBaseEntityDatesStub);
          expect(customer.updatedAt).toEqual(customerBaseEntityDatesStub);
        });
      });

      describe('And all customer fields are specified', () => {
        it('Should create a customer with all specified values', () => {
          const customer = CustomerEntity.create(createCustomerAllProps) as CustomerEntity;

          expect(customer).toBeInstanceOf(CustomerEntity);
          expect(customer.id).toBe(createCustomerAllProps.id);
          expect(customer.name).toBe(createCustomerAllProps.name);
          expect(customer.phone).toBe(createCustomerAllProps.phone);
          expect(customer.email).toBe(createCustomerAllProps.email);
          expect(customer.document).toBe(createCustomerAllProps.document);
          expect(customer.createdAt).toEqual(createCustomerAllProps.createdAt);
          expect(customer.updatedAt).toEqual(createCustomerAllProps.updatedAt);
        });
      });
    });

    describe.each(Object.keys(fieldsWithInvalidValues))('When invalid values are provided', (key) => {
      describe.each(fieldsWithInvalidValues[key])(`And the ${key} field is set to: "%s"`, (value) => {
        it('Should throw an InvalidInputDataException', () => {
          expect(() => CustomerEntity.create({ ...createCustomerAllProps, [key]: value })).toThrow(
            `Invalid customer data, ${key} is required.`,
          );
        });
      });
    });
  });
});
