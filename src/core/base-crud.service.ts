import { Injectable } from '@nestjs/common';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import * as helper from '../core/helper';

@Injectable()
export class BaseCrudService<T> {
  constructor(private repositoty: Repository<T>, private alias: string) {}

  async create(entity: any) {
    const result = await this.repositoty.save(entity);
    return result;
  }

  async update(id: number, patch: any) {
    const existing = await this.repositoty.findOneOrFail(id);
    const entity = {
      ...existing,
      ...patch,
    };
    return this.repositoty.save(entity);
  }

  findAll({ search = {}, columns = undefined, limit = 100 }) {
    const query = this.allQuery({ search, columns });

    query.limit(limit);

    return query.getMany();
  }

  async query({ page, perPage, search, columns }) {
    const query = this.allQuery({ search, columns });

    query.where(search);

    query.skip(helper.getSkip(page, perPage));

    query.take(perPage);

    const result = await query.getManyAndCount();

    return result;
  }

  private allQuery({ search, columns }): SelectQueryBuilder<T> {
    const query = this.repositoty.createQueryBuilder(this.alias);

    if (columns) {
      const select = [];
      columns.split(',').forEach((c: string) => {
        if (c.includes('.')) {
          select.push(c);
        } else {
          select.push(`${this.alias}.${c}`);
        }
      });
      query.select(select);
    }

    Object.keys(search).forEach((key) => {
      search[key] = ILike(`%${search[key].toLowerCase()}%`);
    });
    query.where(search);

    return query;
  }

  findOne(id: number) {
    return this.repositoty.findOne(id);
  }

  remove(id: number) {
    return this.repositoty.delete(id);
  }
}
