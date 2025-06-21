import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private readonly OTP_EXPIRATION_MINUTES = 10;
  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      to: email,
      subject: 'Votre OTP de vérification',
      template: 'OTP',
      context: {
        otp,
        expiresIn: this.OTP_EXPIRATION_MINUTES,
      },
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail:", error);
      return { success: false };
    }
  }
}
