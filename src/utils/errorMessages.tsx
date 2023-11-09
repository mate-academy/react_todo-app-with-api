import { Errors } from '../types/enums/Errors';

export const errorHandler = (erroType: Errors) => {
  switch (erroType) {
    case Errors.GET:
      return 'Unable to load todos';

    case Errors.POST:
      return 'Unable to add a todo';

    case Errors.EMPTY:
      return 'Title should not be empty';

    case Errors.PATCH:
      return 'Unable to update a todo';

    default:
      return 'Unable to delete a todo';
  }
};
