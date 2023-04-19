import { Temporal } from "@js-temporal/polyfill";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetPasswordToken } from "src/data/entitites/reset-password-token.entity";
import { LessThan, Repository } from "typeorm";
import {MonthOverviewOrderMonth} from "../../data/other-models/month-overview.models";
import {OrderMonthService} from "../../core/order-month/order-month.service";
import {EmailService} from "../email/email.service";

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
        // Log a message to the console to show that the scheduling has started.
        console.log('[#] ---------- execute scheduling ---------- [#]');
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
    private async monthlyPaymentReminder(){
        const orderMonths = await this.orderMonthService.monthOverview();
        const currentMonth = Temporal.Now.plainDateISO();
        const lastMonth = currentMonth.subtract({ months: 1 });

        const filteredOrderMonths = orderMonths
            .filter((om) => {
                const omDate = Temporal.PlainDate.from({ year: om.year, month: om.month, day: 1 });
                return omDate.month === lastMonth.month && omDate.year === lastMonth.year && !om.paid
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