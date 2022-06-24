import { AuditBaseEntity } from '../base/audit-base.entity';
import { Column, Entity } from 'typeorm';

@Entity('menues')
export class Menu extends AuditBaseEntity {
  @Column({ name: 'label' })
  public label: string;

  @Column({ name: 'router_link', nullable: true })
  public routerLink: string;

  @Column({ name: 'icon', nullable: true })
  public icon: string;

  @Column({ name: 'parent_id', nullable: true })
  public parentId: number;
}
