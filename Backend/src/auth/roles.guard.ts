import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    const role = request.headers['role'];

    if (!authorization || !authorization.startsWith('e')) {
      throw new ForbiddenException(' not authenticated');
    }

    
    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
