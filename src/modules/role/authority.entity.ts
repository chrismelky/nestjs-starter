import { IsNotEmpty } from 'class-validator';
import { AuditBaseEntity } from '../base/audit-base.entity';
import { Column, Entity } from 'typeorm';

@Entity('authorities')
export class Authority extends AuditBaseEntity {
  @Column({ name: 'name', length: 100, nullable: false, unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ name: 'code', length: 200, nullable: false, unique: true })
  @IsNotEmpty()
  code: string;

  @Column({ name: 'resource', length: 100, nullable: false })
  @IsNotEmpty()
  resource: string;
}
