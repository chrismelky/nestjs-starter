import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { validate } from 'class-validator';
import { AuditBaseEntity } from './audit-base.entity';
import { IBaseService } from './IBase.service';
import { QueryParams } from '../../core/query-params';

export class BaseController<T extends AuditBaseEntity> {
  constructor(private readonly IBaseService: IBaseService<T>) {}

  //Som
  @Get()
  async fetch(@Query() query: QueryParams) {
    const {
      page = 1,
      size: size = 30,
      columns,
      sortField,
      sortOrder,
      ...search
    } = query;
    const [result, count] = await this.IBaseService.paginate({
      page,
      size,
      search,
      columns,
      sortField,
      sortOrder,
    });
    return this.sendResponse({ result, count, page, size });
  }

  @Post()
  async create(@Body() dto: T) {
    await validate(dto);
    const result = await this.IBaseService.create(dto);
    return this.sendResponse({
      result,
      message: 'User created successfully',
    });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDto: any) {
    const result = await this.IBaseService.update(id, updateDto);
    return this.sendResponse({ result, message: 'User updated successfully' });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.IBaseService.delete(+id);
    return this.sendMessage('User deleted successfully');
  }

  sendResponse(response: any) {
    if (response.page) {
      return {
        data: response.result,
        page: +response.page,
        size: +response.size,
        total: response.count,
        message: response.message,
      };
    }
    return {
      data: response.result,
    };
  }

  sendMessage(message: string) {
    return {
      message,
    };
  }
}
