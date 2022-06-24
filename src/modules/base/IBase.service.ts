import { AuditBaseEntity } from './audit-base.entity';
import { QueryParams } from '../../core/query-params';

export interface IBaseService<T extends AuditBaseEntity> {
  create(entity: T): Promise<T>;
  update(id: number, patch: any): Promise<T>;
  getOne(id: number): Promise<T>;
  getAll(param?: QueryParams): Promise<T[]>;
  paginate(param?: QueryParams): Promise<[T[], number]>;
  delete(id: number): Promise<void>;
  getEagerRelation(): string[];
  getEagerSelect(): string[];
}
