import {Module} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';
import { SchedulingService } from './cleanup/scheduling.service';
import {EmailService} from './email/email.service';
import { HashService } from './hash/hash.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ResetPasswordToken])
  ],
  providers: [EmailService, HashService, SchedulingService], exports: [EmailService, HashService, SchedulingService]
})
export class SharedModule {
}
