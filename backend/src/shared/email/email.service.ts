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

    /**
     * Send an email to the user with a link to reset their password.
     *
     * @param email The email address of the user.
     * @param token The token that will be used to verify the request.
     */
    sendResetPasswordMail(email: string, token: string) {
        // Create a link to the reset password page with the token as a query parameter.
        const resetPasswordLink = `http://localhost:4200/auth/reset/${token}`;
        // Create the options for the email.
        const mailOptions = {
            from: this.email,
            to: email,
            subject: 'Passwort zurücksetzen',
            html: this.resetPasswordText(resetPasswordLink)
        };
        // Send the email.
        this.client.sendMail(mailOptions, (error: Error) => {
            if(error) {
                this.logger.log(error);
            } else {
                this.logger.log('Reset password email sent to ' + email);
            }
        });
    }

    /**
     * Send an email to the user with a verification code to reset their password.
     *
     * @param email The email address of the user.
     * @param code The code that will be used to verify the request.
     */
    sendVerificationMail(email: string, code: string) {
        // Create the options for the email.
        const mailOptions = {
            from: this.email,
            to: email,
            subject: 'Passwort zurücksetzen',
            html: this.verificationText(code)
        };
        // Send the email.
        this.client.sendMail(mailOptions, (error: Error) => {
            if(error) {
                this.logger.log(error);
            } else {
                this.logger.log('Reset password email sent to ' + email);
            }
        });
    }

    /**
     * Sends a mail to the given email address with a temporary password.
     * @param email The email address to send the mail to.
     * @param tempPassword The temporary password to be sent in the mail.
     */
    sendTempPasswordMail(email: string, tempPassword: string) {
        // Set the email options
        const mailOptions = {
            from: this.email,
            to: email,
            subject: 'Passwort zurücksetzen',
            html: this.resetPasswordText(tempPassword)
        };
        // Send the email
        this.client.sendMail(mailOptions, (error: Error, info: any) => {
            // If an error occurred, log it
            if(error) {
                this.logger.log(error);
            } else {
                this.logger.log('Email sent: ' + info.response);
            }
        });
    }

    private resetPasswordText(resetLink: string): string {
        return (
            `Sehr geehrter Nutzer, 
            <br><br>
            
            wir haben eine Anfrage erhalten, um Ihr Passwort zurückzusetzen. 
            <br>
            Um diesen Vorgang abzuschließen, klicken Sie bitte auf den folgenden Link: ${resetLink}. 
            <br><br>
            Bitte beachten Sie, dass dieser Link nur für begrenzte Zeit gültig ist. Sollten Sie ihn nicht innerhalb von 24 Stunden öffnen, wird er automatisch ablaufen. In diesem Fall müssen Sie den Zurücksetzungsvorgang erneut durchführen.
            <br>
            Wenn Sie diese Anfrage nicht selbst gestellt haben oder sich unsicher sind, kontaktieren Sie uns bitte umgehend.
            
            <br><br>
            Guten Hunger<br>
            Euer Speiseplan-Team ;)`
        );
    }

    private tempPasswordText(tempPassword: string): string {
        return (
            `Ihr neues Passwort lautet: <label style="color: #00629F">${tempPassword}</label>. Ändern Sie bitte nach der Anmeldung Ihr Passwort.`
            );
    }

    private verificationText(code: string): string {
        return (
            `Sehr geehrter Nutzer, 
            <br><br>
            
            wir haben eine Anfrage erhalten, um Ihr Passwort zurückzusetzen. 
            <br>
            Ihr Verifizierungscode lautet: 
            <br><br>
            ${code} 
            <br><br>
            Bitte beachten Sie, dass dieser Code nur für begrenzte Zeit gültig ist. Sollten Sie ihn nicht innerhalb von 24 Stunden verwenden, wird er automatisch ablaufen. 
            <br>
            In diesem Fall müssen Sie den Zurücksetzungsvorgang erneut durchführen.
            <br>
            Wenn Sie diese Anfrage nicht selbst gestellt haben oder sich unsicher sind, kontaktieren Sie uns bitte umgehend.
            
            <br><br>
            Guten Hunger<br>
            Ihr Speiseplan-Team ;)`
        );
    }
}
