import { CustomerEntity } from '@/domain/entities/customer.entity';
import { CustomerOutput } from '@/application/dtos/customer.output';

export class GetCustomerByIdDocOutput {
  public readonly customer: CustomerOutput;

  constructor(entity: CustomerEntity) {
    this.customer = new CustomerOutput(entity);
  }
}
