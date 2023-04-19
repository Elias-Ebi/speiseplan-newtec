import {Module} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';
import { SchedulingService } from './scheduling/scheduling.service';
import {EmailService} from './email/email.service';
import { HashService } from './hash/hash.service';
import {User} from "../data/entitites/user.entity";
import {Profile} from "../data/entitites/profile.entity";
import {OrderMonth} from "../data/entitites/order-month.entity";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {OrderMonthService} from "../core/order-month/order-month.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ResetPasswordToken, User, Profile, OrderMonth])
  ],
  providers: [EmailService, HashService, SchedulingService, AuthService, JwtService, OrderMonthService], exports: [EmailService, HashService, SchedulingService]
})
export class SharedModule {
}
