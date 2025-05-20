import { Repository } from 'typeorm';

import { currentCustomerEntity, currentCustomerRaw } from '@/fixtures/customer-fixtures';
import { CustomerEntity } from '@/domain/entities/customer.entity';
import { CustomerRepository } from '@/infrastructure/repositories/customer.repository';

describe('CustomerRepository', () => {
  // Fixtures & Stubs
  const { id, email, document } = currentCustomerEntity;
  const customerSuccessDBResponse = currentCustomerRaw;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let typeOrmRepository: Repository<any>;
  let customerRepository: CustomerRepository;

  beforeEach(() => {
    typeOrmRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
    } as unknown as Repository<never>;
    customerRepository = new CustomerRepository(typeOrmRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the attempts to fetch customers with pagination parameters', () => {
    const customersQueryArgs = { take: 3, skip: 0 };

    describe('When customers are found for the specified pagination range', () => {
      it('should return the paginated list of customers', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'find').mockResolvedValue([customerSuccessDBResponse, customerSuccessDBResponse]);

        // Act
        const result = await customerRepository.getCustomers(customersQueryArgs);

        // Assert
        expect(typeOrmRepository.find).toHaveBeenCalledWith({ ...customersQueryArgs, withDeleted: false });
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        result.forEach((customer) => expect(customer).toBeInstanceOf(CustomerEntity));
      });
    });

    describe('When no customers are found for the specified pagination range', () => {
      const emptyCustomersListDBResponse = [];

      it('should return an empty array', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(emptyCustomersListDBResponse);

        // Act
        const result = await customerRepository.getCustomers(customersQueryArgs);

        // Assert
        expect(typeOrmRepository.find).toHaveBeenCalledWith({ ...customersQueryArgs, withDeleted: false });
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('Given the attempts to fetch a customer with a specific id', () => {
    const customerIdParam = id;

    describe('When the customer exists on database', () => {
      it('should return the customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.getCustomerById(customerIdParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { id: customerIdParam },
          withDeleted: false,
        });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the customer does not exist', () => {
      const customerNotFoundDBResponse = null;

      it('should return null', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerNotFoundDBResponse);

        // Act
        const result = await customerRepository.getCustomerById(customerIdParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { id: customerIdParam },
          withDeleted: false,
        });
        expect(result).toBeNull();
      });
    });
  });

  describe('Given the attempts to fetch a customer with a specific document number', () => {
    const customerIdDocParam = document;

    describe('When the customer exists on database', () => {
      it('should return a customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.getCustomerByIdDoc(customerIdDocParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { document: customerIdDocParam },
          withDeleted: false,
        });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the customer does not exist', () => {
      const customerNotFoundDBResponse = null;

      it('should return null', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerNotFoundDBResponse);

        // Act
        const result = await customerRepository.getCustomerByIdDoc(customerIdDocParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { document: customerIdDocParam },
          withDeleted: false,
        });
        expect(result).toBeNull();
      });
    });
  });

  describe('Given the attempts to fetch a customer with a specific email address', () => {
    const customerEmailParam = email;

    describe('When the customer exists on database', () => {
      it('should return a customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.getCustomerByEmail(customerEmailParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { email: customerEmailParam },
          withDeleted: false,
        });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the customer does not exist', () => {
      const customerNotFoundDBResponse = null;

      it('should return null', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(customerNotFoundDBResponse);

        // Act
        const result = await customerRepository.getCustomerByEmail(customerEmailParam);

        // Assert
        expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
          where: { email: customerEmailParam },
          withDeleted: false,
        });
        expect(result).toBeNull();
      });
    });
  });

  describe('Given the attempts to create a customer', () => {
    const customerEntityInput = currentCustomerEntity;

    describe('When the customer input is valid', () => {
      it('should return a customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.createCustomer(customerEntityInput);

        // Assert
        expect(typeOrmRepository.save).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the operation unexpected fails', () => {
      const customerFailureDBResponse = new Error('Repository error');

      it('should propagate the database error', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'save').mockRejectedValue(customerFailureDBResponse);

        // Act
        const promise = customerRepository.createCustomer(customerEntityInput);

        // Assert
        await expect(promise).rejects.toThrow(customerFailureDBResponse);
        expect(typeOrmRepository.save).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
      });
    });
  });

  describe('Given the attempts to update a customer', () => {
    const customerEntityInput = currentCustomerEntity;

    describe('When the customer input is valid', () => {
      it('should return a customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.updateCustomer(customerEntityInput);

        // Assert
        expect(typeOrmRepository.save).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the operation unexpected fails', () => {
      const customerFailureDBResponse = new Error('Repository error');

      it('should propagate the database error', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'save').mockRejectedValue(customerFailureDBResponse);

        // Act
        const promise = customerRepository.updateCustomer(customerEntityInput);

        // Assert
        await expect(promise).rejects.toThrow(customerFailureDBResponse);
        expect(typeOrmRepository.save).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
      });
    });
  });

  describe('Given the attempts to delete a customer', () => {
    const customerEntityInput = currentCustomerEntity;

    describe('When the customer input is valid', () => {
      it('should return a customer entity', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'softRemove').mockResolvedValue(customerSuccessDBResponse);

        // Act
        const result = await customerRepository.deleteCustomer(customerEntityInput);

        // Assert
        expect(typeOrmRepository.softRemove).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
        expect(result).toBeInstanceOf(CustomerEntity);
      });
    });

    describe('When the operation unexpected fails', () => {
      const customerFailureDBResponse = new Error('Repository error');

      it('should propagate the database error', async () => {
        // Arrange
        jest.spyOn(typeOrmRepository, 'softRemove').mockRejectedValue(customerFailureDBResponse);

        // Act
        const promise = customerRepository.deleteCustomer(customerEntityInput);

        // Assert
        await expect(promise).rejects.toThrow(customerFailureDBResponse);
        expect(typeOrmRepository.softRemove).toHaveBeenCalledWith({ ...customerEntityInput }, { reload: true });
      });
    });
  });
});
