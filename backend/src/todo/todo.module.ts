import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { makeCounterProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';
import { MetricsMiddleware } from 'src/metrics/metrics.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoController } from './todo.controller';
import { TodoMiddleware } from './todo.middleware';
import { TodoService } from './todo.service';
import { UserHelper } from './user.helper';

@Module({

  controllers: [TodoController],
  providers: [TodoService, PrismaService, UserHelper, makeCounterProvider({
    name: 'count',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status', 'path'],
  }), makeGaugeProvider({
    name: 'gauge',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status', 'path'],
  }), makeCounterProvider({
    name: 'app_errors_metrics',
    help: 'Custom errors counter',
    labelNames: ['method', 'status', 'path', 'time_interval'],
  }),
    makeGaugeProvider({
      name: 'app_duration_metrics',
      help: 'Custom duration gauge',
      labelNames: ['method', 'status', 'path'],
    }),],
})
export class TodoModule implements NestModule {
  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer.apply(MetricsMiddleware).forRoutes(TodoController);
    consumer.apply(TodoMiddleware).forRoutes(TodoController);

  }
}
