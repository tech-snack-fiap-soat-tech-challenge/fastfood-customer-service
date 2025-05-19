import { CustomerEntity } from '@/domain/entities/customer.entity';

export class CustomerOutput {
  id: number;

  name: string;

  email: string;

  phone: string;

  document: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(entity: CustomerEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.email = entity.email.value;
    this.phone = entity.phone.value;
    this.document = entity.document.value;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
