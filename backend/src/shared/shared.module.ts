import { Module } from '@nestjs/common';
import { DateService } from './date/date.service';

@Module({
  providers: [DateService],
  exports: [DateService]
})
export class SharedModule {}
