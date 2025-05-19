import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { UpdateCustomerCommand } from '@/application/use-cases/update-customer/update-customer.command';
import { UpdateCustomerOutput } from '@/application/use-cases/update-customer/update-customer.output';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand, UpdateCustomerOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(command: UpdateCustomerCommand): Promise<UpdateCustomerOutput> {
    const entity = command.toEntity();

    const customerWithId = await this.customerRepository.getCustomerById(entity.id);
    if (!customerWithId) {
      throw new EntityNotFoundException('customer', 'id', entity.id);
    }

    const customerWithEmail = await this.customerRepository.getCustomerByEmail(entity.email);
    if (customerWithEmail && customerWithEmail.id !== entity.id) {
      throw new EntityDuplicatedException('customer', 'email address');
    }

    const customerWithDocument = await this.customerRepository.getCustomerByIdDoc(entity.document);
    if (customerWithDocument && customerWithDocument.id !== entity.id) {
      throw new EntityDuplicatedException('customer', 'document number');
    }

    const updatedCustomer = await this.customerRepository.updateCustomer(entity);

    return new UpdateCustomerOutput(updatedCustomer);
  }
}
