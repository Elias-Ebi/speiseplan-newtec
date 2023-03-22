import { Temporal } from "@js-temporal/polyfill";
import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ResetPasswordToken } from "src/data/entitites/reset-password-token.entity";
import { LessThan, Repository } from "typeorm";

@Injectable()
export class DataCleanupService {
    constructor(
        @InjectRepository(ResetPasswordToken) private resetPasswordTokenRepository: Repository<ResetPasswordToken>) {
    }

    // @Cron('15 22 * * *') // Cron-Job, executed 22:15
    @Cron('0 0 * * *') // Cron-Job executed at midnight
    async deleteExpiredData() {
        console.log('[#] ---------- execute cleanup ---------- [#]');
        const currentTime = Temporal.Now.plainDateTimeISO();
        const expireTime = currentTime.add({days: 1});
        // Delete all entries in password token table older than 24 hours
        await this.resetPasswordTokenRepository.delete({ updatedAt: LessThan(expireTime.toString()) });
    }
}