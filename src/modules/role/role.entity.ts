import { IsNotEmpty } from 'class-validator';
import { AuditBaseEntity } from 'src/core/audit-base.entity';
import { Column, Entity } from 'typeorm';

@Entity('roles')
export class Role extends AuditBaseEntity {
  @Column({ name: 'name', length: 100, nullable: false, unique: true })
  @IsNotEmpty()
  name: string;
}
