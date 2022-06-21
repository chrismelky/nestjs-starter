import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { BaseController } from '../../core/base.controller';
import { validate } from 'class-validator';
import { QueryParams } from '../../core/query-params';
import { Public } from '../../core/public.annotation';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';

@Controller('api/roles')
export class RoleController extends BaseController {
  constructor(private readonly roleService: RoleService) {
    super();
  }

  @Get()
  @Public()
  async fetch(@Query() query: QueryParams) {
    const { page, size, columns, sortField, sortOrder, ...search } = query;

    if (page) {
      const [result, count] = await this.roleService.paginate({
        page,
        size,
        search,
        columns,
        sortField,
        sortOrder,
      });
      return this.sendResponse({
        result,
        count,
        page,
        size,
        sortField,
        sortOrder,
      });
    } else {
      const result = await this.roleService.findAll({
        columns,
        search,
        sortField,
        sortOrder,
      });
      return this.sendResponse({ result });
    }
  }

  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    await validate(roleDto);
    const data = {
      ...new Role(),
      ...roleDto,
    };
    const result = await this.roleService.create(data);
    return this.sendResponse({ result });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    await this.roleService.update(+id, updateRoleDto);
    const result = await this.roleService.repository.findOneBy({ id: +id });
    return this.sendResponse({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.roleService.findOne(+id);
    return this.sendResponse({ result });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.roleService.remove(+id);
    return this.sendMessage('Role deleted successfully');
  }
}
