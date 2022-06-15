import { IsNotEmpty } from 'class-validator';
import { AuditBaseEntity } from '../../core/audit-base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Authority } from './authority.entity';

@Entity('roles')
export class Role extends AuditBaseEntity {
  @Column({ name: 'name', length: 100, nullable: false, unique: true })
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => Authority)
  @JoinTable({
    name: 'role_authorities',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'authority_id', referencedColumnName: 'id' },
  })
  authorities: Authority[];
}
