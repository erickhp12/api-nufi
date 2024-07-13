import moment from 'moment';
import fs from 'fs';
import config from '../config.json';

interface MailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  sender: string;
}

interface Config {
  mail_config: MailConfig;
}

interface SuccessResponse<T> {
  error: false;
  message: string;
  data: T;
  results: number;
}

interface ErrorResponse {
  error: true;
  message: string;
  data: any[];
  results: number;
}

const log = (title: string, content: string): void => {    
  fs.appendFileSync(`./logs/${moment().format("DD-MM-YYYY")}.txt`, `${moment().format("ddd-DD-MM HH:mm:ss")} - ${title}: ${content}\n`);
  console.log(`${moment().format("ddd-DD-MM HH:mm:ss")} - ${title}: ${content}`);
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

// const sendEmail = (title: string, content: string, receivers: string): void => {
//   const transporter = nodemailer.createTransport({
//     host: config.mail_config.host,
//     port: config.mail_config.port,
//     auth: {
//       user: config.mail_config.user,
//       pass: config.mail_config.password
//     }
//   });

//   transporter.sendMail({
//     from: config.mail_config.sender,
//     to: receivers,
//     subject: title,
//     text: content
//   }).then(() => log(`Correo enviado a ${receivers} 📧`))
//     .catch(error => log(error.toString()));
// }

const returnSuccess = <T>(message: string, data: T = {} as T, results: number = 0): SuccessResponse<T> => {
  return {
    error: false,
    message: message,
    data: data,
    results: results
  }
}

const returnError = (message: string): ErrorResponse => {
  return {
    error: true,
    message: message,
    data: [],
    results: 0
  }
}

const generateRandomNumber = (length: number): number | undefined => {
  if (length < 1) return undefined;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  returnError,
  returnSuccess,
  generateRandomNumber,
  log,
  sleep
};
