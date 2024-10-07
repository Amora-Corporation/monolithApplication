import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Utilisation de la variable d'environnement
        pass: process.env.EMAIL_PASS, // Utilisation de la variable d'environnement
      },
    });
  }
  

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Utilisation de la variable d'environnement pour l'adresse "from"
      to: email,
      subject: 'Votre OTP de vérification',
      text: `Votre code OTP est : ${otp}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
      return { success: false };
    }
  }
}
