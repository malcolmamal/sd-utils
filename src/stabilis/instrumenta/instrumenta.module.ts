import { Module } from '@nestjs/common';

import { InstrumentaController } from './application/controllers/instrumenta.controller';
import { InstrumentaService } from './application/services/instrumenta.service';

@Module({
  imports: [],
  controllers: [InstrumentaController],
  providers: [InstrumentaService],
})
export class InstrumentaModule {}
