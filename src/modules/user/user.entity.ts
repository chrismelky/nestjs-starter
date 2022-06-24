import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AuditBaseEntity } from '../base/audit-base.entity';
import { Role } from '../role/role.entity';

@Entity('users')
export class User extends AuditBaseEntity {
  constructor() {
    super();
  }
  @Column({ name: 'first_name', length: 100 })
  @IsNotEmpty()
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'email', length: 100, unique: true, nullable: false })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ name: 'password', length: 200 })
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
