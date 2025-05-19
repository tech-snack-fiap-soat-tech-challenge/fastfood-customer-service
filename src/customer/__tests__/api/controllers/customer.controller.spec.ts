import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { currentCustomerEntity, currentCustomerRaw } from '@/app/customer/__fixtures__/customer-fixtures';
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
import { CustomerController } from '@/presentation/controllers/customer.controller';

describe('CustomerController', () => {
  // Fixtures & Stubs
  const { id, name, email, phone, document } = currentCustomerRaw;

  let controller: CustomerController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('getAllCustomers', () => {
    const customersQueryArgs = { take: 10, skip: 0 };

    it('should return a list of customers', async () => {
      // Arrange
      const customersUseCaseResponse = new GetAllCustomersOutput([currentCustomerEntity]);
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(customersUseCaseResponse);

      // Act
      const result = await controller.getAllCustomers(customersQueryArgs.take, customersQueryArgs.skip);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllCustomersQuery(customersQueryArgs));
      expect(result).toEqual(customersUseCaseResponse.customers);
    });

    it('should handle errors when customers fetch fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(queryBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.getAllCustomers(customersQueryArgs.take, customersQueryArgs.skip);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllCustomersQuery());
    });
  });

  describe('getCustomerById', () => {
    const customerIdParam = id;

    it('should return a customer', async () => {
      // Arrange
      const customerUseCasesResponse = new GetCustomerByIdOutput(currentCustomerEntity);
      jest.spyOn(queryBus, 'execute').mockResolvedValue(customerUseCasesResponse);

      const result = await controller.getCustomerById(customerIdParam);

      expect(queryBus.execute).toHaveBeenCalledWith(new GetCustomerByIdQuery(customerIdParam));
      expect(result).toEqual(customerUseCasesResponse.customer);
    });

    it('should handle errors when customer fetch fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(queryBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.getCustomerById(customerIdParam);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetCustomerByIdQuery(customerIdParam));
    });
  });

  describe('getCustomerByIdDoc', () => {
    const customerIdDocParam = document;

    it('should return a customer by document number', async () => {
      // Arrange
      const customerUseCasesResponse = new GetCustomerByIdDocOutput(currentCustomerEntity);
      jest.spyOn(queryBus, 'execute').mockResolvedValue(customerUseCasesResponse);

      // Act
      const result = await controller.getCustomerByIdDoc(customerIdDocParam);

      // Assert
      expect(queryBus.execute).toHaveBeenCalledWith(new GetCustomerByIdDocQuery(customerIdDocParam));
      expect(result).toEqual(customerUseCasesResponse.customer);
    });

    it('should handle errors when customer fetch fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(queryBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.getCustomerByIdDoc(customerIdDocParam);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetCustomerByIdDocQuery(customerIdDocParam));
    });
  });

  describe('createCustomer', () => {
    const customerPayload = { name, email, phone, document };

    it('should create a customer successfully', async () => {
      // Arrange
      const customerUseCasesResponse = new CreateCustomerOutput(currentCustomerEntity);
      jest.spyOn(commandBus, 'execute').mockResolvedValue(customerUseCasesResponse);

      // Act
      const result = await controller.createCustomer(customerPayload);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(new CreateCustomerCommand(customerPayload));
      expect(result).toEqual(customerUseCasesResponse.customer);
    });

    it('should handle errors when customer create fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(commandBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.createCustomer(customerPayload);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(commandBus.execute).toHaveBeenCalledWith(new CreateCustomerCommand(customerPayload));
    });
  });

  describe('updateCustomer', () => {
    const customerIdParam = id;
    const customerPayload = { name, email, phone, document };

    it('should update a customer successfully', async () => {
      // Arrange
      const customerUseCasesResponse = new UpdateCustomerOutput(currentCustomerEntity);
      jest.spyOn(commandBus, 'execute').mockResolvedValue(customerUseCasesResponse);

      // Act
      const result = await controller.updateCustomer(customerIdParam, customerPayload);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(new UpdateCustomerCommand(customerIdParam, customerPayload));
      expect(result).toEqual(customerUseCasesResponse.customer);
    });

    it('should handle errors when customer update fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(commandBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.updateCustomer(customerIdParam, customerPayload);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(commandBus.execute).toHaveBeenCalledWith(new UpdateCustomerCommand(customerIdParam, customerPayload));
    });
  });

  describe('deleteCustomer', () => {
    const customerIdParam = id;

    it('should delete a customer successfully', async () => {
      // Arrange
      const customerUseCasesResponse = new DeleteCustomerOutput(currentCustomerEntity);
      jest.spyOn(commandBus, 'execute').mockResolvedValue(customerUseCasesResponse);

      // Act
      const result = await controller.deleteCustomer(customerIdParam);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(new DeleteCustomerCommand(customerIdParam));
      expect(result).toEqual(customerUseCasesResponse.customer);
    });

    it('should handle errors when customer delete fails', async () => {
      // Arrange
      const customerUseCaseFailure = new Error('An unexpected error occurred.');
      jest.spyOn(commandBus, 'execute').mockRejectedValue(customerUseCaseFailure);

      // Act
      const promise = controller.deleteCustomer(customerIdParam);

      // Assert
      await expect(promise).rejects.toThrow(customerUseCaseFailure.message);
      expect(commandBus.execute).toHaveBeenCalledWith(new DeleteCustomerCommand(customerIdParam));
    });
  });
});
