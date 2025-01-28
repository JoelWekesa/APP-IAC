import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoMiddleware } from './todo.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from './user.helper';


@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService, UserHelper],
})
export class TodoModule implements NestModule {
  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer.apply(TodoMiddleware).forRoutes('todo');
  }
}
