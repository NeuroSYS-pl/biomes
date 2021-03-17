import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Client } from 'pg';
import { promises as fs } from 'fs';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private readonly engine = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  async run(filepath: string): Promise<boolean> {
    const migration = await fs.readFile(filepath, 'utf-8');

    try {
      await this.engine.query('BEGIN');
      await this.engine.query(migration);
      await this.engine.query('COMMIT');
      this.logger.log(`Applied migration: ${filepath}`);
      return true;
    } catch (error) {
      await this.engine.query('ROLLBACK');
      this.logger.error(`Rollback migration: ${filepath} due to ${error}`);
      return false;
    }
  }

  async exists(tablename: string): Promise<boolean> {
    const row = await this.engine.query<[boolean]>(
      "SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = $1",
      [tablename],
    );
    return row.rows.length > 0;
  }

  async onModuleInit(): Promise<void> {
    await this.engine.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.engine.end();
  }
}
