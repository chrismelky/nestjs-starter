import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('api/roles')
export class RoleController extends BaseController<Role> {
  constructor(private readonly roleService: RoleService) {
    super(roleService);
  }
}
