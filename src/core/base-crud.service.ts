import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditBaseEntity } from './audit-base.entity';

@Injectable()
export class BaseCrudService<T extends AuditBaseEntity> {
  private entity: { new (): T };
  constructor(private repositoty: Repository<T>) {
    console.log(this.entity);
  }

  async create(createDto: any) {
    console.log(new this.entity());
    const data = {
      ...new this.entity(),
      ...createDto,
    };
    console.log(data);
    const result = await this.repositoty.save(data);
    return result;
  }

  findAll() {
    return this.repositoty.find();
  }

  paginate({ page, per_page, search, columns }) {
    const skip = ((page || 1) - 1) * (per_page || 10);

    const query = this.repositoty.createQueryBuilder('u');

    query.select('first_name');

    query.skip(skip);

    query.take(per_page);

    return query.getManyAndCount();
  }

  findOne(id: number) {
    return this.repositoty.findOne(id);
  }

  // async update(id: number, updateDto: any) {
  //   let entity = await this.repositoty.findOne(id);
  //   entity = {
  //     ...entity,
  //     ...updateDto,
  //   };
  //   return this.repositoty.save(entity);
  // }

  remove(id: number) {
    return this.repositoty.delete(id);
  }
}
