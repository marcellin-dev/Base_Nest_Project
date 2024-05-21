import * as nodemailer from 'nodemailer';
import * as multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as process from 'process';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export function uniqueId() {
  return uuidv4();
}
const configService = new ConfigService();
export function sendEmail(email: string, message: string, subject?: string) {
  console.log(email, '--', message);

  console.log('envoi du mail');

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, //25,
    // secure: false,
    //service: 'gmail',
    auth: {
      user: 'oasis@btaorg.com',
      pass: 'Oasis123@',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: 'oasis@btaorg.com',
    to: email,
    subject: subject || 'SSWAP NOTIFICATION',
    // text: message,
    html: message,
  };

  try {
    transporter?.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        Logger.log(error);
      } else {
        Logger.log('Email sent: ' + info.response);
      }
    });
  } catch (err) {
    Logger.log('error send mail ', err);
  }
}

export function generateOtp() {
  return Math.floor(Math.random() * (999999 - 100000) + 100000);
}

export const storageMulter = multer?.diskStorage({
  destination: function (req, file, cb) {
    cb(null, configService.get('UPLOAD_DIR'));
  },
  filename: function (req, file, cb) {
    const ext = (file?.originalname || '')?.match(/\..*$/)[0];
    console.log('ex ', file);
    const name = file?.originalname?.split('.')[0]?.replace(/\s/g, '');

    cb(null, name + '-' + uniqueId() + ext);
  },
});

export const storageIdentityMulter = multer?.diskStorage({
  destination: function (req, file, cb) {
    cb(null, configService.get('UPLOAD_IDENTITY_DIR'));
  },
  filename: function (req, file, cb) {
    const ext = (file?.originalname || '')?.match(/\..*$/)[0];
    console.log('ex ', file);
    const name = file?.originalname?.split('.')[0]?.replace(/\s/g, '-');

    cb(null, name + '-' + uniqueId() + ext);
  },
});

export function generateUniqueOrderNumber() {
  const currentDate = new Date();
  const datePart = currentDate.toISOString().slice(2, 10).replace(/-/g, ''); // Obtient la date au format YYMMDD

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const timePart = `${hours}${minutes}`; // Obtient l'heure au format HHMM

  const randomString = Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 7)
    .toUpperCase(); // Génère une chaîne aléatoire de chiffres et de lettres en majuscules

  return `SS${datePart}.${timePart}.${randomString}`;
}

export function calculateTransactionFee(transactionAmount) {
  // Calcul du montant des frais
  const feeAmount = transactionAmount * (Number(process.env.FEES || 3) / 100);
  return Math.ceil(feeAmount);
}

export const limitsFile = { fileSize: 10 * 1024 * 1024 };

export const wait = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeout);
    }, timeout);
  });

export function getOperatorByphone(phoneNumber: string) {
  const prefixes: any = {
    MTN: [
      '650',
      '651',
      '652',
      '653',
      '654',
      '670',
      '671',
      '672',
      '673',
      '674',
      '675',
      '676',
      '677',
      '678',
      '679',
      '680',
      '681',
      '682',
      '683',
      '684',
      '685',
      '686',
      '687',
      '688',
      '689',
    ],
    ORANGE: [
      '690',
      '691',
      '692',
      '693',
      '694',
      '695',
      '696',
      '697',
      '698',
      '699',
      '655',
      '656',
      '657',
      '658',
      '659',
    ],
  };

  let prefix = '';
  phoneNumber.startsWith('237')
    ? (prefix = phoneNumber.substring(3, 6))
    : (prefix = phoneNumber.substring(0, 3));

  for (const operator in prefixes) {
    if (prefixes[operator].includes(prefix)) {
      return operator ;
    }
  }

  return null ;
}
