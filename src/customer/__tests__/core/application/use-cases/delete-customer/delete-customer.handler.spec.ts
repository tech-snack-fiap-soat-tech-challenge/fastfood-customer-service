import { currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { DeleteCustomerHandler } from '@/application/use-cases/delete-customer/delete-customer.handler';
import { DeleteCustomerOutput } from '@/application/use-cases/delete-customer/delete-customer.output';
import { DeleteCustomerCommand } from '@/application/use-cases/delete-customer/delete-customer.command';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('DeleteCustomerHandler', () => {
  // Fixtures & Stubs
  const deleteCustomerCommandPayload = new DeleteCustomerCommand(currentCustomerRaw.id);
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const customerNotFoundRepoResponse = null;

  let customerRepo: ICustomerRepository;
  let handler: DeleteCustomerHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomerById: jest.fn(),
      deleteCustomer: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new DeleteCustomerHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to delete a customer', () => {
    beforeEach(() => {
      jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(currentCustomerRepoResponse);
    });

    describe('When a non-existing id is provided in the input', () => {
      it('should throw a customer not found exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(customerNotFoundRepoResponse);

        // Act
        const promise = handler.execute(deleteCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(
          new EntityNotFoundException('customer', 'id', deleteCustomerCommandPayload.id),
        );
        expect(customerRepo.deleteCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When an already existing id is provided in the input', () => {
      it(`should return the deleted customer's data successfully`, async () => {
        // Arrange
        jest.spyOn(customerRepo, 'deleteCustomer').mockResolvedValue(currentCustomerRepoResponse);

        // Act
        const result = await handler.execute(deleteCustomerCommandPayload);

        // Assert
        expect(result).toBeInstanceOf(DeleteCustomerOutput);
        expect(result.customer).toBeInstanceOf(CustomerOutput);
      });
    });
  });
});
