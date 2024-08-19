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

export {
  returnError,
  returnSuccess,
  generateRandomNumber,
  log,
  sleep
};
