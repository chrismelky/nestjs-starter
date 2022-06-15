import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BaseController } from '../../core/base.controller';
import { validate } from 'class-validator';
import { QueryOption } from '../../core/query-params';
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

  @Post()
  async create(@Body() roleDto: CreateRoleDto) {
    const data = {
      ...new Role(),
      ...roleDto,
    };
    await validate(data);
    const result = await this.roleService.create(data);
    return this.sendResponse({ result });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const result = await this.roleService.update(+id, updateRoleDto);
    return this.sendResponse({ result });
  }

  @Get()
  @Public()
  async read(@Query() query: QueryOption) {
    const { page, perPage, columns, sortField, sortOrder, ...search } = query;

    if (page) {
      const [result, count] = await this.roleService.paginate({
        page,
        perPage,
        search,
        columns,
        sortField,
        sortOrder,
      });
      return this.sendResponse({ result, count, page, perPage });
    }
    const result = await this.roleService.findAll({ columns, search });
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
