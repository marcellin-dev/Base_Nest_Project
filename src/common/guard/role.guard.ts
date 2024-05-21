// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getClass(), context.getHandler()],
    );

    console.log('requiredRoles ===> ', requiredRoles);
    if (!requiredRoles) {
      return true; // Si aucun rôle n'est spécifié, l'accès est autorisé
    }
    const request = context.switchToHttp().getRequest();

    console.log('user =====> ', request.user);
    return requiredRoles.includes(request.user.role?.name);
  }
}
