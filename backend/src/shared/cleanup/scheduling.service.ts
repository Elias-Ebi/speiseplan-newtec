import { Temporal } from "@js-temporal/polyfill";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetPasswordToken } from "src/data/entitites/reset-password-token.entity";
import { LessThan, Repository } from "typeorm";
import {MonthOverviewOrderMonth} from "../../data/other-models/month-overview.models";
import {OrderMonthService} from "../../core/order-month/order-month.service";
import PlainDate = Temporal.PlainDate;
import {EmailService} from "../email/email.service";
import PlainYearMonth = Temporal.PlainYearMonth;

@Injectable()
export class SchedulingService {
    constructor(
        @InjectRepository(ResetPasswordToken) private resetPasswordTokenRepository: Repository<ResetPasswordToken>,
        private orderMonthService: OrderMonthService,
        private emailService: EmailService
    ) {}

    // Deletes all entries in password token table older than 24 hours
    // @Cron('15 22 * * *') // Cron-Job, executed 22:15
    @Cron('0 0 * * *') // Cron-Job executed at midnight
    async deleteExpiredData() {
        // Log a message to the console to show that the cleanup has started.
        console.log('[#] ---------- execute cleanup ---------- [#]');
        try {
            // Get the current time and add one day to it.
            const currentTime = Temporal.Now.plainDateTimeISO();
            const expireTime = currentTime.add({days: 1});
            // Delete all reset password tokens where the created date is older than the expire time.
            await this.resetPasswordTokenRepository.delete({ updatedAt: LessThan(expireTime.toString()) });
        } catch (error) {
            // Log any errors to the console.
            console.log('Error in deleting expired data', error);
        }
    }

    @Cron('0 4 1 * *')
    async monthlyPaymentReminder(){
        const orderMonths = await this.orderMonthService.monthOverview();
        const currentMonth = Temporal.Now.plainDateISO();
        const lastMonth = currentMonth.subtract({ months: 1 });

        const filteredOrderMonths = orderMonths
            .filter((om) => {
                const omDate = PlainDate.from({ year: om.year, month: om.month, day: 1 });
                return omDate.equals(lastMonth);
            })
            .sort((a, b) => {
                const aDate = PlainDate.from({ year: a.year, month: a.month, day: 1 });
                const bDate = PlainDate.from({ year: b.year, month: b.month, day: 1 });
                return PlainYearMonth.compare(aDate, bDate);
            });

        const months: MonthOverviewOrderMonth[] = filteredOrderMonths.map((om) => {
            return {
                id: om.id,
                profile: om.profile,
                yearMonth: `${om.year}-${om.month.toString().padStart(2, '0')}`,
                month: om.month,
                year: om.year,
                orders: om.orders,
                total: om.total,
                paid: om.paid,
            };
        })

        this.emailService.sendNewPaymentReminder(months);
    }
}