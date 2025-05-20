import * as crypto from 'node:crypto';

import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  readonly id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
  readonly deletedAt: Date | undefined;

  protected constructor(props: Partial<BaseEntity> = {}) {
    const { id, createdAt, updatedAt, deletedAt } = props;

    this.id = id ?? this.generateNewId();
    this.createdAt = createdAt ?? this.generateNewDate();
    this.updatedAt = updatedAt ?? this.generateNewDate();
    this.deletedAt = deletedAt ?? undefined;
  }

  generateNewId(): number {
    return crypto.randomInt(1, 1000000);
  }

  generateNewDate(): Date {
    return new Date();
  }
}
