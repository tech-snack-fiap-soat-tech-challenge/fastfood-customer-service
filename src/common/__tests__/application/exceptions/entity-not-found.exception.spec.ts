import { EntityNotFoundException } from '@/application/exceptions/entity-not-found.exception';

describe('EntityNotFoundException', () => {
  it('should create exception with error message', () => {
    const exception = new EntityNotFoundException('some entity', 'email', 'test@test.com');
    expect(exception.message).toBe('some entity with email test@test.com was not found.');
  });

  it('should be instance of Error', () => {
    // @ts-expect-error for test
    const exception = new EntityNotFoundException('Test error');
    expect(exception).toBeInstanceOf(Error);
  });
});
