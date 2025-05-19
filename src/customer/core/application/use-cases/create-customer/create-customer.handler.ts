import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CreateCustomerOutput } from '@/application/use-cases/create-customer/create-customer.output';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand, CreateCustomerOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(command: CreateCustomerCommand): Promise<CreateCustomerOutput> {
    const customerEntity = command.toEntity();

    const customerWithEmail = await this.customerRepository.getCustomerByEmail(customerEntity.email);
    if (customerWithEmail) {
      throw new EntityDuplicatedException('customer', 'email address');
    }

    const customerWithDocument = await this.customerRepository.getCustomerByIdDoc(customerEntity.document);
    if (customerWithDocument) {
      throw new EntityDuplicatedException('customer', 'document number');
    }

    const createdCustomer = await this.customerRepository.createCustomer(customerEntity);

    return new CreateCustomerOutput(createdCustomer);
  }
}
