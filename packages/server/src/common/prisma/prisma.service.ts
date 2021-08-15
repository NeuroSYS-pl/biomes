import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { yellow, blue } from 'chalk';
import { PrismaClient } from '@biomes/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public readonly client = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }],
  });

  async onModuleInit(): Promise<void> {
    this.client.$on('query', ev => {
      const query = blue(ev.query);
      const params = blue(ev.params);
      const duration = yellow(`${ev.duration}ms`);
      this.logger.debug(`${query} with ${params} in ${duration}`);
    });
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
