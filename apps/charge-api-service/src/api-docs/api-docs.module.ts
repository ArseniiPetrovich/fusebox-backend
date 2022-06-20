import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyModule } from '../api-keys/api-keys.module';
import { ApiDocsController } from './api-docs.controller';

@Module({
  imports: [
    ApiKeyModule,
    HttpModule,
    ConfigModule
  ],
  controllers: [ApiDocsController]
})
export class ApiDocsModule {}
