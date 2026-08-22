import { z } from 'zod';

export const englishTextRule = (fieldName: string) =>
  z
    .string()
    .regex(/^[\x00-\x7F]*$/, `${fieldName} must be in English (Latin characters only)`);

export const requiredEnglishText = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .regex(/^[\x00-\x7F]*$/, `${fieldName} must be in English (Latin characters only)`);