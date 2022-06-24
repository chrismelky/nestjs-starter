import { Injectable } from '@nestjs/common';
import { ILike, Repository, SelectQueryBuilder } from 'typeorm';
import * as helper from '../../core/helper';
import { AuditBaseEntity } from './audit-base.entity';
import { IBaseService } from './IBase.service';

@Injectable()
export abstract class BaseCrudService<T extends AuditBaseEntity>
  implements IBaseService<T>
{
  constructor(private genericRepository: Repository<any>) {}

  alias = 'root';

  create(entity: T): Promise<T> {
    return this.genericRepository.save(entity);
  }

  async update(id: number, patch: any): Promise<T> {
    const retrievedEntity = await this.genericRepository.findOneByOrFail({
      id,
    });
    Object.assign(retrievedEntity, patch);
    return this.genericRepository.save(retrievedEntity);
  }

  getOne(id: number): Promise<T> {
    return this.genericRepository.findOneBy({ id });
  }

  getAll({
    search = {},
    columns = undefined,
    limit = 100,
    sortField = undefined,
    sortOrder = 'ASC',
  }): Promise<T[]> {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.limit(limit);

    return query.getMany();
  }

  paginate({
    page,
    size,
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }): Promise<[T[], number]> {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.addSelect(this.getEagerSelect());

    this.getEagerRelation().forEach((er: string) => {
      query.leftJoin(`${this.alias}.${er}`, er);
    });

    query.skip(helper.getSkip(page, size));

    query.take(size);

    return query.getManyAndCount();
  }

  delete(id: number): Promise<any> {
    return this.genericRepository.delete(id);
  }

  pageQuery({
    page,
    size,
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }) {
    const query = this.allQuery({ search, columns, sortField, sortOrder });

    query.skip(helper.getSkip(page, size));

    query.take(size);

    return query;
  }

  allQuery({
    search,
    columns,
    sortField = undefined,
    sortOrder = 'ASC',
  }: any): SelectQueryBuilder<T> {
    const query = this.genericRepository.createQueryBuilder(this.alias);

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

  getEagerRelation(): string[] {
    return [];
  }
  getEagerSelect(): string[] {
    return [];
  }
}
