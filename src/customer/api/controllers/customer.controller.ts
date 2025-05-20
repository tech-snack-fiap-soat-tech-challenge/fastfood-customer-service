import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { GetAllCustomersQuery } from '@/application/use-cases/get-all-customers/get-all-customers.query';
import { GetAllCustomersOutput } from '@/application/use-cases/get-all-customers/get-all-customers.output';
import { GetCustomerByIdQuery } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.query';
import { GetCustomerByIdOutput } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.output';
import { GetCustomerByIdDocQuery } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.query';
import { GetCustomerByIdDocOutput } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.output';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CreateCustomerOutput } from '@/application/use-cases/create-customer/create-customer.output';
import { UpdateCustomerCommand } from '@/application/use-cases/update-customer/update-customer.command';
import { UpdateCustomerOutput } from '@/application/use-cases/update-customer/update-customer.output';
import { DeleteCustomerCommand } from '@/application/use-cases/delete-customer/delete-customer.command';
import { DeleteCustomerOutput } from '@/application/use-cases/delete-customer/delete-customer.output';
import { CustomerResponse } from '@/presentation/dtos/customer.response';
import { CustomerRequest } from '@/presentation/dtos/customer.request';

@ApiTags('Customers api endpoints')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /** Retrieves a list of customers with optional pagination parameters */
  @Get('/')
  async getAllCustomers(@Query('take') take?: number, @Query('skip') skip?: number): Promise<CustomerResponse[]> {
    const result = await this.queryBus.execute<GetAllCustomersQuery, GetAllCustomersOutput>(
      new GetAllCustomersQuery({ take, skip }),
    );
    return result.customers;
  }

  /** Creates a new customer with the provided customer information */
  @Post('/')
  async createCustomer(@Body() dto: CustomerRequest): Promise<CustomerResponse> {
    const response = await this.commandBus.execute<CreateCustomerCommand, CreateCustomerOutput>(
      new CreateCustomerCommand(dto),
    );

    return response.customer;
  }

  /** Updates existing customer information using their unique identifier */
  @Put('/:id')
  async updateCustomer(@Param('id') id: number, @Body() dto: CustomerRequest): Promise<CustomerResponse> {
    const result = await this.commandBus.execute<UpdateCustomerCommand, UpdateCustomerOutput>(
      new UpdateCustomerCommand(id, dto),
    );
    return result.customer;
  }

  /** Removes an existing customer using their unique identifier */
  @Delete('/:id')
  async deleteCustomer(@Param('id') id: number): Promise<CustomerResponse> {
    const result = await this.commandBus.execute<DeleteCustomerCommand, DeleteCustomerOutput>(
      new DeleteCustomerCommand(id),
    );
    return result.customer;
  }

  /** Retrieves a specific customer using their CPF document number */
  @Get('/document/')
  async getCustomerByIdDoc(@Query('value') value: string): Promise<CustomerResponse> {
    const result = await this.queryBus.execute<GetCustomerByIdDocQuery, GetCustomerByIdDocOutput>(
      new GetCustomerByIdDocQuery(value),
    );
    return result.customer;
  }

  /** Retrieves a specific customer using their unique identifier */
  @Get('/:id')
  async getCustomerById(@Param('id') id: number): Promise<CustomerResponse> {
    const result = await this.queryBus.execute<GetCustomerByIdQuery, GetCustomerByIdOutput>(
      new GetCustomerByIdQuery(id),
    );
    return result.customer;
  }
}
