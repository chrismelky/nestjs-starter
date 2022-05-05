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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from '../../core/base.controller';
import { QueryOption } from 'src/core/query-params';
import * as bcrypt from 'bcrypt';

@Controller('api/users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  async create(@Body() createUserDto: any) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash('Secret1234', 10),
    };
    const result = this.userService.create(data);
    return this.sendResponse({
      result,
      message: 'User created successfully',
    });
  }

  @Get()
  async findAll(@Query() query: QueryOption) {
    const { page, perPage, columns, ...search } = query;

    console.log(search);
    if (query.page) {
      const [result, count] = await this.userService.paginate({
        page,
        perPage,
        search,
        columns,
      });
      return this.sendResponse({ result, count, page, perPage });
    } else {
      const result = await this.userService.findAll();
      return this.sendResponse({ result });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sendResponse(this.userService.findOne(+id));
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   const result = this.userService.update(+id, updateUserDto);
  //   return this.sendResponse({ result, message: 'User updated successfully' });
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.userService.remove(+id);
    return this.sendMessage('User deleted successfully');
  }
}
