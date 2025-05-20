import { anotherCustomerRaw, currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';
import { CreateCustomerHandler } from '@/application/use-cases/create-customer/create-customer.handler';
import { CreateCustomerOutput } from '@/application/use-cases/create-customer/create-customer.output';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('CreateCustomerHandler', () => {
  // Fixtures & Stubs
  const createCustomerCommandPayload = new CreateCustomerCommand(currentCustomerRaw);
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const anotherCustomerRepoResponse = new CreateCustomerCommand(anotherCustomerRaw).toEntity();

  let customerRepo: ICustomerRepository;
  let handler: CreateCustomerHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomerByEmail: jest.fn(),
      getCustomerByIdDoc: jest.fn(),
      createCustomer: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new CreateCustomerHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to create a customer', () => {
    beforeEach(() => {
      jest.spyOn(customerRepo, 'getCustomerByEmail').mockResolvedValue(null);
      jest.spyOn(customerRepo, 'getCustomerByIdDoc').mockResolvedValue(null);
    });

    describe('When an already existing email address is provided in the input', () => {
      it('should throw a duplicated email address exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByEmail').mockResolvedValue(anotherCustomerRepoResponse);

        // Act
        const promise = handler.execute(createCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(new EntityDuplicatedException('customer', 'email address'));
        expect(customerRepo.createCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When an already existing document number is provided in the input', () => {
      it('should throw a duplicated document number exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByIdDoc').mockResolvedValue(anotherCustomerRepoResponse);

        // Act
        const promise = handler.execute(createCustomerCommandPayload);

        // Assert
        await expect(promise).rejects.toThrow(new EntityDuplicatedException('customer', 'document number'));
        expect(customerRepo.createCustomer).not.toHaveBeenCalled();
      });
    });

    describe('When unique email address and document number values are provided in the input', () => {
      it(`should return the created customer's data successfully`, async () => {
        // Arrange
        jest.spyOn(customerRepo, 'createCustomer').mockResolvedValue(currentCustomerRepoResponse);

        // Act
        const result = await handler.execute(createCustomerCommandPayload);

        // Assert
        expect(result).toBeInstanceOf(CreateCustomerOutput);
        expect(result.customer).toBeInstanceOf(CustomerOutput);
      });
    });
  });
});
