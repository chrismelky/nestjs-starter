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
import { UserService } from './user.service';
import { BaseController } from '../../core/base.controller';
import { QueryParams } from '../../core/query-params';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

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
    const [result, count] = await this.userService.paginate({
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
  async create(@Body() createUserDto: CreateUserDto) {
    await validate(createUserDto);
    const result = await this.userService.create(createUserDto);
    return this.sendResponse({
      result,
      message: 'User created successfully',
    });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.repository.findOneByOrFail({ id });
    Object.assign(user, updateUserDto);
    const result = await this.userService.update(user);
    return this.sendResponse({ result, message: 'User updated successfully' });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.delete(+id);
    return this.sendMessage('User deleted successfully');
  }
}
