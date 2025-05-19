import { InvalidInputDataException } from '@/domain/exceptions/invalid-input-data.exception';

describe('InvalidInputDataException', () => {
  it('should create exception with error message', () => {
    const exception = new InvalidInputDataException('some entity', 'An invalid field value as provided');
    expect(exception.message).toBe('Invalid some entity data, An invalid field value as provided.');
  });

  it('should be instance of Error', () => {
    // @ts-expect-error for test
    const exception = new InvalidInputDataException('Test error');
    expect(exception).toBeInstanceOf(Error);
  });
});
