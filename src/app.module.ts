import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PinoLoggerModule } from '@shared/logger';

@Module({
  imports: [AuthModule, PinoLoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
