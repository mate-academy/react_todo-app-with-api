import { ERROR_MESSAGE, MAIN_PHRASES } from '../constants';

export type MainPhrasesKeys = keyof typeof MAIN_PHRASES;
export type MainPhrases = (typeof MAIN_PHRASES)[MainPhrasesKeys];

export type ErrorMessageKeys = keyof typeof ERROR_MESSAGE;
export type ErrorMessage = (typeof ERROR_MESSAGE)[ErrorMessageKeys];
