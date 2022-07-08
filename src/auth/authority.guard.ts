import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../core/public.annotation';

@Injectable()
export class AuthorityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const controller = context.getClass().name?.toUpperCase();
    const method = context
      .getHandler()
      .name?.toUpperCase()
      .replace('CONTROLLER', '');
    const methodAuthority = `${method}_${controller}`;
    const requiredRoles = [`MANAGE_${controller}`, methodAuthority];
    // console.log(methodAuthority);

    return true; //requiredRoles.some((authority) => user?.roles?.includes(authority));
  }
}
