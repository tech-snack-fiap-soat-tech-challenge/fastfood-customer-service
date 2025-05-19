import { anotherCustomerRaw, currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { UpdateCustomerHandler } from '@/application/use-cases/update-customer/update-customer.handler';
import { UpdateCustomerOutput } from '@/application/use-cases/update-customer/update-customer.output';
import { UpdateCustomerCommand } from '@/application/use-cases/update-customer/update-customer.command';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('UpdateCustomerHandler', () => {
  // Fixtures & Stubs
  const updateCustomerCommandPayload = new UpdateCustomerCommand(currentCustomerRaw.id, currentCustomerRaw);
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const anotherCustomerRepoResponse = new CreateCustomerCommand(anotherCustomerRaw).toEntity();
  const customerNotFoundRepoResponse = null;

  let customerRepo: ICustomerRepository;
  let handler: UpdateCustomerHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomerById: jest.fn(),
      getCustomerByEmail: jest.fn(),
      getCustomerByIdDoc: jest.fn(),
      updateCustomer: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new UpdateCustomerHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to update a customer', () => {
    beforeEach(() => {
      jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(currentCustomerRepoResponse);
    });

    describe('When a non-existing id is provided in the input', () => {
      it('should throw a customer not found exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(customerNotFoundRepoResponse);

        // Act
        const promise = handler.execute(updateCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(
          new EntityNotFoundException('customer', 'id', updateCustomerCommandPayload.id),
        );
        expect(customerRepo.updateCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When an already existing email address is provided in the input', () => {
      it('should throw a duplicated email address exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByEmail').mockResolvedValue(anotherCustomerRepoResponse);

        // Act
        const promise = handler.execute(updateCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(new EntityDuplicatedException('customer', 'email address'));
        expect(customerRepo.updateCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When an already existing document number is provided in the input', () => {
      it('should throw a duplicated document number exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByIdDoc').mockResolvedValue(anotherCustomerRepoResponse);

        // Act
        const promise = handler.execute(updateCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(new EntityDuplicatedException('customer', 'document number'));
        expect(customerRepo.updateCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When unique email address and document number are provided in the input', () => {
      it(`should return the updated customer's data successfully`, async () => {
        // Arrange
        jest.spyOn(customerRepo, 'updateCustomer').mockResolvedValue(currentCustomerRepoResponse);

        // Act
        const result = await handler.execute(updateCustomerCommandPayload);

        // Assert
        expect(result).toBeInstanceOf(UpdateCustomerOutput);
        expect(result.customer).toBeInstanceOf(CustomerOutput);
      });
    });
  });
});
