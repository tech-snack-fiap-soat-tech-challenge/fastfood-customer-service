import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@/app/common/common.module';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { GetAllCustomersHandler } from '@/application/use-cases/get-all-customers/get-all-customers.handler';
import { GetCustomerByIdHandler } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.handler';
import { GetCustomerByIdDocHandler } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.handler';
import { CreateCustomerHandler } from '@/application/use-cases/create-customer/create-customer.handler';
import { UpdateCustomerHandler } from '@/application/use-cases/update-customer/update-customer.handler';
import { DeleteCustomerHandler } from '@/application/use-cases/delete-customer/delete-customer.handler';
import { CustomerRepository } from '@/infrastructure/repositories/customer.repository';
import { CustomerController } from '@/presentation/controllers/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), CqrsModule, CommonModule],
  controllers: [CustomerController],
  providers: [
    {
      provide: ICustomerRepository,
      useClass: CustomerRepository,
    },
    CreateCustomerHandler,
    UpdateCustomerHandler,
    DeleteCustomerHandler,
    GetAllCustomersHandler,
    GetCustomerByIdHandler,
    GetCustomerByIdDocHandler,
  ],
})
export class CustomerModule {}
