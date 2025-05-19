import { EntityDuplicatedException } from '@/application/exceptions/entity-duplicated.exception';

describe('EntityDuplicatedException', () => {
  it('should create exception with error message', () => {
    const exception = new EntityDuplicatedException('some entity', 'id');
    expect(exception.message).toBe('some entity with the provided id already exists.');
  });

  it('should be instance of Error', () => {
    // @ts-expect-error for test
    const exception = new EntityDuplicatedException('Test error');
    expect(exception).toBeInstanceOf(Error);
  });
});
