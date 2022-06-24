import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../base/base-crud.service';

@Injectable()
export class UserService extends BaseCrudService<User> {
  alias = 'users';
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository);
  }

  /**
   * Override create method to add default password to new user
   */
  async create(createUserDto: User) {
    const data = {
      ...new User(),
      ...createUserDto,
      password: await bcrypt.hash('Secret1234', 10),
    };
    const result = await this.repository.save(data);
    return result;
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  getEagerRelation(): string[] {
    return ['roles'];
  }

  getEagerSelect(): string[] {
    return ['roles.id', 'roles.name'];
  }
}
