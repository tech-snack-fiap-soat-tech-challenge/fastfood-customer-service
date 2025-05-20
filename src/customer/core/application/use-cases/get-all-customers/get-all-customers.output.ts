import { CustomerOutput } from '@/application/dtos/customer.output';
import { CustomerEntity } from '@/domain/entities/customer.entity';

export class GetAllCustomersOutput {
  public readonly customers: CustomerOutput[];

  constructor(entitiesList: CustomerEntity[]) {
    this.customers = entitiesList.map((entity) => new CustomerOutput(entity));
  }
}
