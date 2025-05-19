import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { GetCustomerByIdQuery } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.query';
import { GetCustomerByIdOutput } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.output';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler implements IQueryHandler<GetCustomerByIdQuery, GetCustomerByIdOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(query: GetCustomerByIdQuery): Promise<GetCustomerByIdOutput> {
    const customer = await this.customerRepository.getCustomerById(query.id);

    if (!customer) {
      throw new EntityNotFoundException('customer', 'id', query.id);
    }

    return new GetCustomerByIdOutput(customer);
  }
}
