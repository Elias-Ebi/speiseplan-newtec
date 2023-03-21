import {Injectable, Logger} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

    sendResetPasswordMail(email: string, token: string) {
        const resetPasswordLink = `http://localhost:3000/auth/reset/${email}/${token}`;

        const mailOptions = {
            from: this.email,
            to: email,
            subject: 'Passwort zurücksetzen',
            html: this.resetPasswordText(resetPasswordLink)
        };

        this.client.sendMail(mailOptions, (error) => {
            if(error) {
                this.logger.log(error);
            }
        });
    }

    sendTempPasswordMail(email: string, tempPassword: string) {
        const mailOptions = {
            from: this.email,
            to: email,
            subject: 'Passwort zurücksetzen',
            html: this.resetPasswordText(tempPassword)
        };

        this.client.sendMail(mailOptions, (error) => {
            if(error) {
                this.logger.log(error);
            }
        });
    }

    private resetPasswordText(resetLink: string): string {
        return "Passwort zurücksetzen! " + resetLink;
    }

    private tempPasswordText(tempPassword: string): string {
        return `Ihr neues Passwort lautet: <label style="color: green">${tempPassword}</label>. Ändern Sie bitte nach der Anmeldung Ihr Passwort.`;
    }
}
