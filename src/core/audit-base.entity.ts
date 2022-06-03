import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';

export abstract class AuditBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uuid', default: randomUUID() })
  uuid: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Column({ name: 'created_by', default: 'system' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
