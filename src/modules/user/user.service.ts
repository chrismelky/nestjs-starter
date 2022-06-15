import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../core/base-crud.service';

@Injectable()
export class UserService extends BaseCrudService<User> {
  alias = 'users';
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {
    super();
  }

  /**
   * Override create method to add default password to new user
   */
  async create(createUserDto: CreateUserDto) {
    const data = {
      ...new User(),
      ...createUserDto,
      password: await bcrypt.hash('Secret1234', 10),
    };
    const result = await this.repository.save(data);
    return result;
  }

  async update(id: number, patch: any) {
    const existing = await this.repository.findOneByOrFail({ id });
    const entity = {
      ...existing,
      ...patch,
    };
    return this.repository.save(entity);
  }

  /**
   * Override pagination method to add eager laoded user roles
   */
  async paginate({ page, perPage, search, columns, sortField, sortOrder }) {
    const query = this.pageQuery({
      page,
      perPage,
      search,
      columns,
      sortField,
      sortOrder,
    });

    query.addSelect(['roles.id', 'roles.name']);
    query.leftJoin('users.roles', 'roles');
    const result = await query.getManyAndCount();
    return result;
  }

  async delete(id: number) {
    await this.repository.findOneByOrFail({ id });
    return this.repository.delete(id);
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }
}
