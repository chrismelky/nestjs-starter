import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from '../base/base-crud.service';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  alias = 'roles';

  constructor(
    @InjectRepository(Role)
    public repository: Repository<Role>,
  ) {
    super(repository);
  }

  getEagerSelect(): string[] {
    return ['authorities.id', 'authorities.name'];
  }
  getEagerRelation(): string[] {
    return ['authorities'];
  }
}
