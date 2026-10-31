import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider.js';

@Module({
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
