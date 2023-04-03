import {Injectable, Logger} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {Profile} from "../../data/entitites/profile.entity";
import {Temporal} from "@js-temporal/polyfill";
import PlainYearMonth = Temporal.PlainYearMonth;
import {MonthOverviewOrderMonth} from "../../data/other-models/month-overview.models";

@Injectable()
export class EmailService {
    private email = 'homepageno-reply@newtec.de';
    client = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: this.email,
            pass: 'qe85f29qwfe#142325!!'
        },
        pool: true,
        maxConnections: 1
    });
    private readonly logger = new Logger(EmailService.name);

    sendNewBanditPlateMail(recipients: string[], mealName: string) {
        recipients.forEach((recipient) => {
            const mailOptions = {
                from: this.email,
                to: recipient,
                subject: 'Neuer Räuberteller',
                html: this.banditPlateMailText(mealName)
            };

            this.client.sendMail(mailOptions, (error) => {
                if (error) {
                    this.logger.log(error);
                }
            });
        });
    }

    sendNewPaymentReminder(monthOverviewOrderMonth: MonthOverviewOrderMonth[])  {
        monthOverviewOrderMonth.forEach((orderMonth) => {
            const mailOptions = {
                from: this.email,
                to: orderMonth.profile.email,
                subject: `Offene Rechnung ${orderMonth.yearMonth}`,
                html: this.paymentReminderMailText(orderMonth.profile.name, orderMonth.yearMonth, orderMonth.total)
            };
            this.client.sendMail(mailOptions, (error) => {
                if (error) {
                    this.logger.log(error);
                }
            });
        });
    }

    private banditPlateMailText(mealName: string): string {
        return (
            `Hallo liebe Mensafreunde,
            <br><br>
            <u>${mealName}</u> wurde gerade als Räuberteller angeboten.<br>
            Falls du lust hast dir diesen zu schnappen, klicke auf folgenden Link: <a href="https://www.newtec.de/">Speiseplan</a>
            <br><br>
            Guten Hunger<br>
            Euer Speiseplan-Team ;)`
        )
    }

    private paymentReminderMailText(recipientName: string, yearMonth: string, total: number): string {
        return (
            `Hallo ${recipientName},
            <br><br>
            du hast für den ${yearMonth} noch eine Rechnung von ${parseFloat(total.toString()).toFixed(2)} € offen.<br>
            <br><br>
            Mit freundlichen Grüßen<br>
            Euer Speiseplan-Team`
        )
    }
}
