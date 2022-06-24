import { Controller } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import { BaseController } from '../base/base.controller';

@Controller('menu')
export class MenuController extends BaseController<Menu> {
  constructor(private readonly menuService: MenuService) {
    super(menuService);
  }
}
