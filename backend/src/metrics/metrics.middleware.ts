import { Counter, Gauge } from 'prom-client';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('count') private readonly appCounter: Counter<string>,
    @InjectMetric('gauge') private readonly appGauge: Gauge<string>,
    @InjectMetric('app_errors_metrics') private readonly customErrorsCounter: Counter<string>,
    @InjectMetric('app_duration_metrics') private readonly customDurationGauge: Gauge<string>,
  ) { }


  use(req: any, res: any, next: () => void) {

    console.log("here");
    this.appCounter.inc();
    this.appGauge.inc();

    const start = Date.now();

    res.on('finish', () => {


      const duration = Date.now() - start;
      this.customDurationGauge.labels(req.method, res.statusCode, req.path).set(duration / 1000);

      if (res.statusCode >= 400) {
        const timeInterval = this.getTimeInterval();
        this.customErrorsCounter.labels(req.method, res.statusCode, req.path, timeInterval).inc();
      }
    });

    next();
  }


  getTimeInterval(): string {
    return '5m';
  }
}
