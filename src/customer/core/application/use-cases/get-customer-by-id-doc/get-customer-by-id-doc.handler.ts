import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { GetCustomerByIdDocQuery } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.query';
import { GetCustomerByIdDocOutput } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.output';

@QueryHandler(GetCustomerByIdDocQuery)
export class GetCustomerByIdDocHandler implements IQueryHandler<GetCustomerByIdDocQuery, GetCustomerByIdDocOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(query: GetCustomerByIdDocQuery): Promise<GetCustomerByIdDocOutput> {
    const documentVO = query.toValueObject();

    const customer = await this.customerRepository.getCustomerByIdDoc(documentVO);

    if (!customer) {
      throw new EntityNotFoundException('customer', 'document number', query.document);
    }

    return new GetCustomerByIdDocOutput(customer);
  }
}
