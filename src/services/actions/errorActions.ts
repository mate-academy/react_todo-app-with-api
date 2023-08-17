import { Types } from '../../enums/Types';
import { ErrorMessageActions } from '../../types/ErrorMessageActionsType';

export const setErrorMessageAction = (message = ''):ErrorMessageActions => {
  return {
    type: Types.SetErrorMessage,
    payload: {
      errorMessage: message,
    },
  };
};
