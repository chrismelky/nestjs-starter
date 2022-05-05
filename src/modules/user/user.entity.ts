import { Column, Entity } from 'typeorm';
import { AuditBaseEntity } from '../../core/audit-base.entity';

@Entity('users')
export class User extends AuditBaseEntity {
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'email', length: 100 })
  email: string;

  @Column({ name: 'password', length: 200 })
  password: string;

  @Column({ name: 'is_active' })
  isActive: boolean;
}
