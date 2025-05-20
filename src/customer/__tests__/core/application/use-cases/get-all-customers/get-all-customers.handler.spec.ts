import { anotherCustomerRaw, currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { GetAllCustomersHandler } from '@/application/use-cases/get-all-customers/get-all-customers.handler';
import { GetAllCustomersOutput } from '@/application/use-cases/get-all-customers/get-all-customers.output';
import { GetAllCustomersQuery } from '@/application/use-cases/get-all-customers/get-all-customers.query';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('GetAllCustomersHandler', () => {
  // Fixtures & Stubs
  const getAllCustomersQueryArgs = new GetAllCustomersQuery();
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const anotherCustomerRepoResponse = new CreateCustomerCommand(anotherCustomerRaw).toEntity();
  const emptyCustomersListRepoResponse = [];

  let customerRepo: ICustomerRepository;
  let handler: GetAllCustomersHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomers: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new GetAllCustomersHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to fetch customers', () => {
    describe('When no customers are found for the params specified', () => {
      it('should return an empty list data successfully', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomers').mockResolvedValue(emptyCustomersListRepoResponse);

        // Act
        const result = await handler.execute(getAllCustomersQueryArgs);

        // Assert
        expect(Array.isArray(result.customers)).toBe(true);
        expect(result.customers).toHaveLength(0);
      });
    });

    describe('When multiple customers are found for the params specified', () => {
      it(`should return the customers list data successfully`, async () => {
        // Arrange
        jest
          .spyOn(customerRepo, 'getCustomers')
          .mockResolvedValue([currentCustomerRepoResponse, anotherCustomerRepoResponse]);

        // Act
        const result = await handler.execute(getAllCustomersQueryArgs);

        // Assert
        expect(result).toBeInstanceOf(GetAllCustomersOutput);
        expect(Array.isArray(result.customers)).toBe(true);
        expect(result.customers).toHaveLength(2);
        result.customers.forEach((customer) => expect(customer).toBeInstanceOf(CustomerOutput));
      });
    });
  });
});
