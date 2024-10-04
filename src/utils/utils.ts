import moment from 'moment';
import fs from 'fs';
import { Clients } from '../models/clientsModel';

interface SuccessResponse<T> {
  error: false;
  message: string;
  data: T;
  results: number;
}

interface ErrorResponse {
  error: true;
  message: string;
  data: {};
  results: number;
}

const log = (content: string): void => { 
  fs.appendFileSync('./logs/'+moment().format("DD-MM-YYYY")+".txt",`${moment().format("ddd-DD-MM HH:mm:ss")} - ${content}\n'`);
  console.log(`${moment().format("ddd-DD-MM HH:mm:ss")} - ${content}`);
}

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

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
    data: {},
    results: 1
  }
}

const generateRandomNumber = (length: number): number | undefined => {
  if (length < 1) return undefined;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const isPasswordValid = (password:string) => {
  // Check for at least 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check for at least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for at least 1 lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for at least 1 numeric digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Check for at least one of these symbols @#$%^&*!
  if (!/[@#$%^&*!]/.test(password)) {
    return false;
  }

  // All requirements met
  return true;
}

const isUsernameValid = (username:string) => {
  if (typeof username !== 'string' || username.length !== 10) return false;
  return true;
}

const isEmailValid = (email:string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const isPhoneValid = (phone:string) => {
    if (typeof phone !== 'string') return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 && digits === phone;
}


const fixAccents = (text: string): string => {
  const accentMap: { [key: string]: string } = {
    '\u00e1': 'á',
    '\u00e9': 'é',
    '\u00ed': 'í',
    '\u00f3': 'ó',
    '\u00fa': 'ú',
    '\u00f1': 'ñ',
    '\u00fc': 'ü'
  };

  return text.replace(/\\u[\dA-F]{4}/gi, (match) => {
    const unicodeChar = String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    return accentMap[unicodeChar] || unicodeChar;
  });
}

const fixAccentsInObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => fixAccentsInObject(item));
  }

  const result: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string') {
        result[key] = fixAccents(obj[key]);
      } else {
        result[key] = fixAccentsInObject(obj[key]);
      }
    }
  }
  return result;
}

export {
  returnError,
  returnSuccess,
  generateRandomNumber,
  log,
  sleep,
  isPasswordValid,
  isUsernameValid,
  isEmailValid,
  isPhoneValid,
  fixAccents,
  fixAccentsInObject
};
