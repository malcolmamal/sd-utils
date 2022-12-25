import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstrumentaModule } from './instrumenta/instrumenta.module';

@Module({
  imports: [InstrumentaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
