import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { InstrumentaService } from './instrumenta/application/services/instrumenta.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [InstrumentaService],
})
export class AppModule {}
