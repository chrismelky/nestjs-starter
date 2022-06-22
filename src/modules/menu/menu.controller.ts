import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import { BaseController } from '../../core/base.controller';
import { validate } from 'class-validator';
import { QueryParams } from '../../core/query-params';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController extends BaseController {
  constructor(private readonly menuService: MenuService) {
    super();
  }

  @Post()
  async create(@Body() createMenuDto: CreateMenuDto) {
    await validate(createMenuDto);
    const menu = {
      ...new Menu(),
      label: createMenuDto.label,
      routerLink: createMenuDto.routerLink,
      icon: createMenuDto.icon,
      parentId: createMenuDto.parentId,
    };
    const result = await this.menuService.create(menu);
    return this.sendResponse({ result });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const menu = await this.menuService.repository.findOneByOrFail({ id: +id });
    Object.assign(menu, updateMenuDto);
    const result = await this.menuService.update(menu);
    return this.sendResponse({ result });
  }

  @Get()
  async fetch(@Query() query: QueryParams) {
    const { page, size, columns, sortField, sortOrder, ...search } = query;
    if (page) {
      const [result, count] = await this.menuService.paginate({
        page,
        size,
        search,
        columns,
        sortField,
        sortOrder,
      });
      return this.sendResponse({ result, count, page, size });
    } else {
      const result = await this.menuService.findAll({
        search,
        columns,
        sortField,
        sortOrder,
      });
      return this.sendResponse({ result });
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.menuService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.menuService.remove(+id);
  // }
}
