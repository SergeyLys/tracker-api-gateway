import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { PinoLoggerModule } from '@SergeyLys/tracker-pinno-logger';

@Module({
  imports: [AuthModule, PinoLoggerModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
