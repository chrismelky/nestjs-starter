import { Injectable } from '@nestjs/common';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import * as helper from '../core/helper';
import { AuditBaseEntity } from './audit-base.entity';

@Injectable()
export abstract class BaseCrudService<T extends AuditBaseEntity> {
  repository: Repository<T>;

  alias: string;

  async create(entity: T) {
    const result = await this.repository.save(entity);
    return result;
  }

  findAll({
    search = {},
    columns = undefined,
    limit = 100,
    sortField = undefined,
    sortOrder = 'ASC',
  }) {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.limit(limit);

    return query.getMany();
  }

  async paginate({
    page,
    perPage,
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }) {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.skip(helper.getSkip(page, perPage));

    query.take(perPage);

    const result = await query.getManyAndCount();

    return result;
  }

  pageQuery({
    page,
    perPage,
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }) {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.skip(helper.getSkip(page, perPage));

    query.take(perPage);

    return query;
  }

  allQuery({
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }: any): SelectQueryBuilder<T> {
    const query = this.repository.createQueryBuilder(this.alias);

    let select = [`${this.alias}`];

    if (columns) {
      select = [];
      columns
        .split(',')
        .forEach((c: string) => select.push(`${this.alias}.${c}`));
    }
    query.select(select);

    Object.keys(search).forEach((key) => {
      search[key] = ILike(`%${search[key].toLowerCase()}%`);
    });
    query.where(search);

    if (sortField !== undefined) {
      query.orderBy(`${this.alias}.${sortField}`, sortOrder);
    }

    return query;
  }
}
