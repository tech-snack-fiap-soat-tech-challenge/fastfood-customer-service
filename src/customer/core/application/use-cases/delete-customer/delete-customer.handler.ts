import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { DeleteCustomerCommand } from '@/application/use-cases/delete-customer/delete-customer.command';
import { DeleteCustomerOutput } from '@/application/use-cases/delete-customer/delete-customer.output';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand, DeleteCustomerOutput> {
  constructor(@Inject(ICustomerRepository) private readonly customerRepository: ICustomerRepository) {}

  async execute(command: DeleteCustomerCommand): Promise<DeleteCustomerOutput> {
    const customerWithId = await this.customerRepository.getCustomerById(command.id);
    if (!customerWithId) {
      throw new EntityNotFoundException('customer', 'id', command.id);
    }

    const deletedCustomer = await this.customerRepository.deleteCustomer(customerWithId);

    return new DeleteCustomerOutput(deletedCustomer);
  }
}
