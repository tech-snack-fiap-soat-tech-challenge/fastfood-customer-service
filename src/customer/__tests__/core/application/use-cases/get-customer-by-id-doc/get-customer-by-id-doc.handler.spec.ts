import { currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { ICustomerRepository } from '@/domain/interfaces/repositories/customer.repository';
import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';
import { GetCustomerByIdDocQuery } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.query';
import { GetCustomerByIdDocHandler } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.handler';
import { GetCustomerByIdDocOutput } from '@/application/use-cases/get-customer-by-id-doc/get-customer-by-id-doc.output';
import { CreateCustomerCommand } from '@/application/use-cases/create-customer/create-customer.command';
import { CustomerOutput } from '@/application/dtos/customer.output';

describe('GetCustomerByIdDocHandler', () => {
  // Fixtures & Stubs
  const getCustomerByIdDocQueryParams = new GetCustomerByIdDocQuery(currentCustomerRaw.document);
  const currentCustomerRepoResponse = new CreateCustomerCommand(currentCustomerRaw).toEntity();
  const customerNotFoundRepoResponse = null;

  let customerRepo: ICustomerRepository;
  let handler: GetCustomerByIdDocHandler;

  beforeEach(() => {
    customerRepo = {
      getCustomerByIdDoc: jest.fn(),
    } as unknown as ICustomerRepository;
    handler = new GetCustomerByIdDocHandler(customerRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to fetch a customer by document', () => {
    describe('When a non-existing document number is provided in the input', () => {
      it('should throw a customer not found exception', async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByIdDoc').mockResolvedValue(customerNotFoundRepoResponse);

        // Act
        const promise = handler.execute(getCustomerByIdDocQueryParams);

        // Assert
        await expect(promise).rejects.toThrow(
          new EntityNotFoundException('customer', 'document number', getCustomerByIdDocQueryParams.document),
        );
      });
    });

    describe(`When an existing document number is provided in the input`, () => {
      it(`should return the customer's data successfully`, async () => {
        // Arrange
        jest.spyOn(customerRepo, 'getCustomerByIdDoc').mockResolvedValue(currentCustomerRepoResponse);

        // Act
        const result = await handler.execute(getCustomerByIdDocQueryParams);

        // Assert
        expect(result).toBeInstanceOf(GetCustomerByIdDocOutput);
        expect(result.customer).toBeInstanceOf(CustomerOutput);
      });
    });
  });
});
