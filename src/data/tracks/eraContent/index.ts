import { HistoryEra } from '@/types';
import { ancientEgyptContent } from './ancientEgypt';
import { romeGreeceContent } from './romeGreece';
import { medievalContent } from './medieval';
import { modernContent } from './modern';
import { revolutionsContent } from './revolutions';
import { chinaContent } from './china';
import { defaultContent } from './default';
import { jewishContent } from './jewish';
import { islamicContent } from './islamic';
import { christianContent } from './christian';
import { russianContent } from './russian';

export interface EraContent {
  eraName: string;
  levelOneName: string;
  levelTwoName: string;
  levelThreeName: string;
  lesson1_2: string;
  lesson1_3: string;
  lesson2_1: string;
  lesson2_2: string;
  lesson3_1: string;
  lesson3_2: string;
}

export const getEraContent = (era: HistoryEra): EraContent => {
  switch (era) {
    case 'ancient-egypt':
      return ancientEgyptContent;
    case 'ancient-greece':
      return romeGreeceContent; // TODO: Replace with unique Greek content
    case 'ancient-rome':
      return romeGreeceContent; // TODO: Replace with unique Roman content
    case 'rome-greece':
      return romeGreeceContent;
    case 'medieval':
      return medievalContent;
    case 'modern':
      return modernContent;
    case 'revolutions':
      return revolutionsContent;
    case 'china':
      return chinaContent;
    case 'jewish':
      return jewishContent;
    case 'islamic':
      return islamicContent; 
    case 'christian':
      return christianContent;
    case 'russian':
      return russianContent;
    default:
      return defaultContent;
  }
};
