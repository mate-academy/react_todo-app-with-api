/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext,
  useMemo,
} from 'react';
import { ErrorTypes } from '../types/ErrorTypes';
import { TodoContext } from './TodoContext';

export const ErrorNotification: React.FC = () => {
  const {
    errorType,
    setErrorType,
  } = useContext(TodoContext);

  const ErrorTypeMsg = useMemo(() => {
    switch (errorType) {
      case ErrorTypes.LoadError:
        return 'Unable to load todos';

      case ErrorTypes.EmptyTitle:
        return 'Title should not be empty';

      case ErrorTypes.AddTodoError:
        return 'Unable to add a todo';

      case ErrorTypes.DeleteTodoError:
        return 'Unable to delete a todo';

      case ErrorTypes.UpdateTodoError:
        return 'Unable to update a todo';

      case ErrorTypes.DuplicateTodoError:
        return 'This todo is already exists';

      default:
        return ErrorTypes.None;
    }
  }, [errorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorType === ErrorTypes.None },
      )}
    >
      <button
        data-cy="HideErrorTypesButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(ErrorTypes.None)}
      />
      {ErrorTypeMsg}
    </div>
  );
};
