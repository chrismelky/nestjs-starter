import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    return this.usersRepository.save(data);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async paginate({ page, perPage, search, columns }) {
    const query = this.usersRepository.createQueryBuilder('user');

    if (columns) {
      const select = [];
      columns.split(',').forEach((c: string) => {
        if (c.includes('.')) {
          select.push(c);
        } else {
          select.push(`user.${c}`);
        }
      });
      query.select(select);
    }
    //TODO handle where with string
    query.where(search);

    query.skip(helper.getSkip(page, perPage));

    query.take(perPage);

    const result = await query.getManyAndCount();

    return result;
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.usersRepository.findOne(id);
    user = {
      ...user,
      ...updateUserDto,
    };
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
