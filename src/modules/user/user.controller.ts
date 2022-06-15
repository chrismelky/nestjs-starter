import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../../core/base.controller';
import { QueryOption } from '../../core/query-params';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';

@Controller('api/users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  async create(@Body() createUserDto: User) {
    await validate(createUserDto);
    const result = await this.userService.create(createUserDto);
    return this.sendResponse({
      result,
      message: 'User created successfully',
    });
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.id !== +id) {
      throw new HttpException('Invalid Request', 400);
    }
    const result = await this.userService.update(+id, updateUserDto);
    return this.sendResponse({ result, message: 'User updated successfully' });
  }

  @Get()
  async read(@Query() query: QueryOption) {
    const {
      page = 1,
      perPage = 30,
      columns,
      sortField,
      sortOrder,
      ...search
    } = query;
    const [result, count] = await this.userService.paginate({
      page,
      perPage,
      search,
      columns,
      sortField,
      sortOrder,
    });
    return this.sendResponse({ result, count, page, perPage });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.userService.delete(+id);
    return this.sendMessage('User deleted successfully');
  }
}
