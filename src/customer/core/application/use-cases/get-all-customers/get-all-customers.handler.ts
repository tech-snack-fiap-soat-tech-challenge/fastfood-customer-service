import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { GetAllCustomersQuery } from '@/application/use-cases/get-all-customers/get-all-customers.query';
import { GetAllCustomersOutput } from '@/application/use-cases/get-all-customers/get-all-customers.output';

@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersHandler implements IQueryHandler<GetAllCustomersQuery, GetAllCustomersOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(query: GetAllCustomersQuery): Promise<GetAllCustomersOutput> {
    const customers = await this.customerRepository.getCustomers(query);

    return new GetAllCustomersOutput(customers);
  }
}
