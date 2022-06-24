import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../base/base-crud.service';
import { Menu } from './menu.entity';

@Injectable()
export class MenuService extends BaseCrudService<Menu> {
  alias = 'menus';
  constructor(@InjectRepository(Menu) public repository: Repository<Menu>) {
    super(repository);
  }
}
