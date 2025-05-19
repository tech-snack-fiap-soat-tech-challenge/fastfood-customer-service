import { CustomerOutput } from '@/application/dtos/customer.output';
import { CustomerEntity } from '@/domain/entities/customer.entity';

export class DeleteCustomerOutput {
  public readonly customer: CustomerOutput;

  constructor(entity: CustomerEntity) {
    this.customer = new CustomerOutput(entity);
  }
}
