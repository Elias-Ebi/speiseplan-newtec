import {Module} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';
import { DataCleanupService } from './cleanup/data-cleanup.service';
import {EmailService} from './email/email.service';
import { HashService } from './hash/hash.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ResetPasswordToken]),
  ],
  providers: [EmailService, HashService, DataCleanupService], exports: [EmailService, HashService, DataCleanupService]
})
export class SharedModule {
}
