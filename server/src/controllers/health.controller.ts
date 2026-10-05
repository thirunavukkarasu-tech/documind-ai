import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const getHealth = (req: Request, res: Response): void => {
  sendSuccess(res, 'DocuMind AI API is running');
};
