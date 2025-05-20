import { CustomerEntity } from '@/domain/entities/customer.entity';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';

export interface ICustomerRepository {
  getCustomers(args: { take: number; skip: number }): Promise<CustomerEntity[]>;

  getCustomerById(id: number): Promise<CustomerEntity | null>;

  getCustomerByEmail(email: EmailAddressVO): Promise<CustomerEntity | null>;

  getCustomerByIdDoc(document: DocumentNumberVo): Promise<CustomerEntity | null>;

  createCustomer(customer: CustomerEntity): Promise<CustomerEntity>;

  updateCustomer(customer: CustomerEntity): Promise<CustomerEntity>;

  deleteCustomer(customer: CustomerEntity): Promise<CustomerEntity>;
}

export const ICustomerRepository = Symbol('ICustomerRepository');
