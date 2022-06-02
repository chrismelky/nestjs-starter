import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as helper from '../../core/helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...new User(),
      ...createUserDto,
      password: await bcrypt.hash('Secret1234', 10),
    };
    const result = await this.usersRepository.save(data);
    return result;
  }

  async query({ page, perPage, search, columns }) {
    const query = this.usersRepository.createQueryBuilder('users');

    if (columns) {
      const select = [];
      columns.split(',').forEach((c: string) => {
        if (c.includes('.')) {
          select.push(c);
        } else {
          select.push(`users.${c}`);
        }
      });
      query.select(select);
    }

    Object.keys(search).forEach((key) => {
      search[key] = ILike(`%${search[key].toLowerCase()}%`);
    });
    query.where(search);

    query.skip(helper.getSkip(page, perPage));

    query.take(perPage);

    const result = await query.getManyAndCount();

    return result;
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, patch: any) {
    const existingUser = await this.usersRepository.findOneOrFail(id);
    const user = {
      ...existingUser,
      ...patch,
    };
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    await this.usersRepository.findOneOrFail(id);
    return this.usersRepository.delete(id);
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
