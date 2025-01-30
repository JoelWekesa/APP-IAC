import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { MetricsController } from './metrics/metrics.controller';
import { PrismaService } from './prisma/prisma.service';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrometheusModule.register(),
    TodoModule,

  ],
  controllers: [AppController, MetricsController],
  providers: [AppService, PrismaService, {
    provide: 'APP_INTERCEPTOR',
    useClass: LoggingInterceptor,
  }],
})
export class AppModule { }
