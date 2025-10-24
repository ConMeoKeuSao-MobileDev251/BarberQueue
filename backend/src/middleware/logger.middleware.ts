import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP', {
    timestamp: true,
  });

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('User-Agent') || '';

    const logger = this.logger;

    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any) {
      const statusCode = res.statusCode;

      logger.log(`${userAgent} | ${method} | ${originalUrl} | ${statusCode}`);

      return originalEnd.call(this, chunk, encoding);
    };

    next();
  }
}
