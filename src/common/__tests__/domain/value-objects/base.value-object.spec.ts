import { BaseValueObject } from '@/domain/value-objects/base.value-object';

interface TestProps {
  value: string;
  number: number;
}

class SomeValueObject extends BaseValueObject<TestProps> {
  protected toJSON() {
    throw new Error('Method not implemented.');
  }
  protected toString(): string {
    throw new Error('Method not implemented.');
  }
  constructor(props: TestProps) {
    super(props);
  }

  public static create(props: TestProps): SomeValueObject {
    return new SomeValueObject(props);
  }

  protected validateProps(props: TestProps): void {
    if (!props.value || !props.number) {
      throw new Error('Missing required properties');
    }
  }
}

describe('BaseValueObject', () => {
  const validProps: TestProps = {
    value: 'test',
    number: 123,
  };

  describe('constructor', () => {
    it('should create an instance with valid props', () => {
      const vo = SomeValueObject.create(validProps);
      expect(vo).toBeDefined();
      expect(vo.getProps()).toEqual(validProps);
    });

    it('should throw error for invalid props', () => {
      const invalidProps = {
        value: '',
        number: 123,
      };

      expect(() => {
        SomeValueObject.create(invalidProps);
      }).toThrow('Missing required properties');
    });

    it('should freeze the props object', () => {
      const vo = SomeValueObject.create(validProps);
      const props = vo.getProps();

      expect(Object.isFrozen(props)).toBeTruthy();
    });
  });

  describe('equals', () => {
    it('should return true for value objects with same props', () => {
      const vo1 = SomeValueObject.create(validProps);
      const vo2 = SomeValueObject.create(validProps);

      expect(vo1.equals(vo2)).toBeTruthy();
    });

    it('should return false for different value objects', () => {
      const vo1 = SomeValueObject.create(validProps);
      const vo2 = SomeValueObject.create({
        value: 'different',
        number: 456,
      });

      expect(vo1.equals(vo2)).toBeFalsy();
    });

    it('should return false for null value object', () => {
      const vo = SomeValueObject.create(validProps);
      const nullVO: BaseValueObject<TestProps> = null as never;
      expect(vo.equals(nullVO)).toBeFalsy();
    });

    it('should return false for undefined value object', () => {
      const vo = SomeValueObject.create(validProps);
      expect(vo.equals(undefined)).toBeFalsy();
    });

    it('should return false for value object with undefined props', () => {
      const vo1 = SomeValueObject.create(validProps);
      const vo2 = { props: undefined } as unknown as BaseValueObject<TestProps>;

      expect(vo1.equals(vo2)).toBeFalsy();
    });
  });

  describe('getProps', () => {
    it('should return the props object', () => {
      const vo = SomeValueObject.create(validProps);
      expect(vo.getProps()).toEqual(validProps);
    });

    it('should return a frozen copy of props', () => {
      const vo = SomeValueObject.create(validProps);
      const props = vo.getProps();

      expect(() => {
        (props as unknown as TestProps).value = 'new value';
      }).toThrow();
    });
  });
});
