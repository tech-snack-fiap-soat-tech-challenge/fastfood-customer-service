import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CustomerEntity } from '@/domain/entities/customer.entity';
import { EmailAddressVO } from '@/domain/value-objects/email-address.vo';
import { DocumentNumberVo } from '@/domain/value-objects/document-number.vo';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async getCustomers(args: { take: number; skip: number }): Promise<CustomerEntity[]> {
    const result = await this.repository.find({
      take: args.take,
      skip: args.skip,
      withDeleted: false,
    });

    return result.map((customer) => CustomerEntity.create(customer)) ?? result;
  }

  async getCustomerById(id: number): Promise<CustomerEntity | null> {
    const result = await this.repository.findOne({
      where: { id },
      withDeleted: false,
    });

    return result !== null ? CustomerEntity.create(result!) : result;
  }

  async getCustomerByEmail(email: EmailAddressVO): Promise<CustomerEntity | null> {
    const result = await this.repository.findOne({
      where: { email },
      withDeleted: false,
    });

    return result !== null ? CustomerEntity.create(result!) : result;
  }

  async getCustomerByIdDoc(document: DocumentNumberVo): Promise<CustomerEntity | null> {
    const result = await this.repository.findOne({
      where: { document },
      withDeleted: false,
    });

    return result !== null ? CustomerEntity.create(result!) : result;
  }

  async createCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
    const result = await this.repository.save({ ...customer }, { reload: true });

    return result !== null ? CustomerEntity.create(result!) : result;
  }

  async updateCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
    const result = await this.repository.save({ ...customer }, { reload: true });

    return result !== null ? CustomerEntity.create(result!) : result;
  }

  async deleteCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
    const result = await this.repository.softRemove({ ...customer }, { reload: true });

    return result !== null ? CustomerEntity.create(result!) : result;
  }
}
