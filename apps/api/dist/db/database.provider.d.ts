import 'dotenv/config';
import { OnApplicationShutdown } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
export type Database = NodePgDatabase<typeof schema>;
export declare class DatabaseProvider implements OnApplicationShutdown {
    readonly db: Database;
    private readonly pool;
    constructor();
    onApplicationShutdown(): Promise<void>;
}
