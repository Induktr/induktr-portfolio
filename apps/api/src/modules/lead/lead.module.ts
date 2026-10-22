import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { LeadResolver } from './lead.resolver';
import { LeadService } from './lead.service';

@Module({
  imports: [TelegramModule],
  providers: [LeadService, LeadResolver],
  exports: [LeadService],
})
export class LeadModule {}
