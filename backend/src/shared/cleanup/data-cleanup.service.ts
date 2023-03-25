import { Temporal } from "@js-temporal/polyfill";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetPasswordToken } from "src/data/entitites/reset-password-token.entity";
import { LessThan, Repository } from "typeorm";

@Injectable()
export class DataCleanupService {
    constructor(
        @InjectRepository(ResetPasswordToken) private resetPasswordTokenRepository: Repository<ResetPasswordToken>
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
}