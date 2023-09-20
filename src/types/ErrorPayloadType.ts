import { Types } from '../enums/Types';

export type ErrorPayload = {
  [Types.SetErrorMessage]: {
    errorMessage: string;
  };
};
