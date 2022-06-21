import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from '../../core/base-crud.service';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends BaseCrudService<Role> {
  alias = 'roles';

  constructor(
    @InjectRepository(Role)
    public repository: Repository<Role>,
  ) {
    super();
  }

  /**
   * Override pagination to add eager loaded authorities
   */
  async paginate({
    page,
    size,
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }: any) {
    const query = this.pageQuery({
      page,
      size,
      search,
      columns,
      sortField,
      sortOrder,
    });
    query.addSelect(['authorities.id', 'authorities.name']);
    query.leftJoin('roles.authorities', 'authorities');
    const result = await query.getManyAndCount();
    return result;
  }

  async findOne(id: number) {
    const role = await this.repository.findOneBy({ id });
    return role;
  }

  async remove(id: number) {
    await this.repository.findOneByOrFail({ id });
    return this.repository.delete(id);
  }
}
