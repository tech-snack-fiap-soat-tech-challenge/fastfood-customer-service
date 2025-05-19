import { BaseEntity } from '@/domain/entities/base.entity';

class SomeEntity extends BaseEntity {
  constructor(props: Partial<BaseEntity> = {}) {
    super(props);
  }
}

describe('BaseEntity', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with default values', () => {
      const entity = new SomeEntity();

      expect(entity.id).toBeDefined();
      expect(entity.id).toBeGreaterThan(0);
      expect(entity.id).toBeLessThan(1000000);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should create an instance with provided values', () => {
      const now = new Date();
      const entity = new SomeEntity({
        id: 1,
        createdAt: now,
        updatedAt: now,
      });

      expect(entity.id).toBe(1);
      expect(entity.createdAt).toBe(now);
      expect(entity.updatedAt).toBe(now);
    });
  });

  describe('generateNewId', () => {
    it('should generate id within valid range', () => {
      const entity = new SomeEntity();
      const id = entity.generateNewId();

      expect(id).toBeGreaterThan(0);
      expect(id).toBeLessThan(1000000);
    });

    it('should generate unique ids', () => {
      const entity = new SomeEntity();
      const ids = new Set();

      // Generate multiple ids and check for uniqueness
      for (let i = 0; i < 10; i++) {
        ids.add(entity.generateNewId());
      }

      // If all ids were unique, the set size should equal the number of iterations
      expect(ids.size).toBe(10);
    });
  });

  describe('generateNewDate', () => {
    it('should generate current date', () => {
      const entity = new SomeEntity();
      const before = new Date();
      const generatedDate = entity.generateNewDate();
      const after = new Date();

      expect(generatedDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(generatedDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
