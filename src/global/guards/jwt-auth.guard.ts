import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}