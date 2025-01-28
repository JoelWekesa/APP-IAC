import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserHelper } from './user.helper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoMiddleware implements NestMiddleware {
  constructor(private readonly userHelper: UserHelper, private readonly prisma: PrismaService) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization;

    if (!auth) {
      throw new UnauthorizedException('User not authorized');
    }

    const userId = auth.split(' ')[1];

    await this.prisma.user.upsert({
      create: {
        id: userId
      },

      update: {
        id: userId
      },

      where: {
        id: userId
      }
    })

    await this.userHelper.setUserId(userId);

    next();
  }
}
