import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate({
    getHandler,
    getArgByIndex,
  }: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', getHandler());
    const { user } = getArgByIndex(0);

    if (!roles || roles.length === 0) return true;

    try {
      if (roles.includes(user.role)) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
}
