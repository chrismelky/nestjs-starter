import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../base/base.controller';
import { User } from './user.entity';

@Controller('api/users')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
