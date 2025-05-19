import { currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { GetCustomerByIdHandler } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.handler';
import { GetCustomerByIdOutput } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.output';
import { GetCustomerByIdQuery } from '@/application/use-cases/get-customer-by-id/get-customer-by-id.query';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('GetCustomerByIdHandler', () => {
  // Fixtures & Stubs
  const getCustomerByIdQueryParams = new GetCustomerByIdQuery(currentCustomerRaw.id);
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const customerNotFoundRepoResponse = null;

  let customerRepo: ICustomerRepository;
  let handler: GetCustomerByIdHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomerById: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new GetCustomerByIdHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to fetch a customer by id', () => {
    describe('When a non-existing id is provided in the input', () => {
      it('should throw a customer not found exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(customerNotFoundRepoResponse);

        // Act
        const promise = handler.execute(getCustomerByIdQueryParams);

        // Assert
        await expect(promise).rejects.toThrow(
          new EntityNotFoundException('customer', 'id', getCustomerByIdQueryParams.id),
        );
      });
    });

    describe('When an existing id is provided in the input', () => {
      it(`should return the customer's data successfully`, async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerById').mockResolvedValue(currentCustomerRepoResponse);

        // Act
        const result = await handler.execute(getCustomerByIdQueryParams);

        // Assert
        expect(result).toBeInstanceOf(GetCustomerByIdOutput);
        expect(result.customer).toBeInstanceOf(CustomerOutput);
      });
    });
  });
});
