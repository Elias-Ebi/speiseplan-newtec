import {Injectable, Logger} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {Order} from "../../data/entitites/order.entity";

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

    sendNewOrderCanceledMail(orders: Order[]) {
        orders.forEach((order) => {
            const mailOptions = {
                from: this.email,
                to: order.profile.email,
                subject: `Bestellung ${order.meal.name} storniert`,
                html: this.orderCancelledMailText(order)
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

    private orderCancelledMailText(order: Order): string {
        if (!order.guestName) {

            return (
                `Hallo ${order.profile.name},
                <br><br>
                leider musste deine Bestellung <u>${order.meal.name}</u> am ${order.date.toString()} storniert werden.
                <br><br>
                Viele Grüße<br>
                Dein Speiseplan-Team`
            )
        } else {
            return (
                `Hallo ${order.profile.name},
                <br><br>
                leider musste die Bestellung <u>${order.meal.name}</u> für deinen Gast ${order.guestName} am ${order.date.toString()} storniert werden.
                <br><br>
                Viele Grüße<br>
                Dein Speiseplan-Team`
            )
        }
    }
}
