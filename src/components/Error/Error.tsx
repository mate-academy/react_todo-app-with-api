import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
  hasError: boolean;
  setHasError: Dispatch<SetStateAction<boolean>>;
};

export const Error: React.FC<Props> = ({
  errorType,
  hasError,
  setHasError,
}) => {
  const errorNotification = (erroTypes: ErrorType) => {
    const errors = {
      [ErrorType.add]: 'Unable to add a todo',
      [ErrorType.update]: 'Unable to update a todo',
      [ErrorType.delete]: 'Unable to delete a todo',
      [ErrorType.empty]: 'Title can\'t be empty',
      [ErrorType.rename]: 'Title is not renamed',
      [ErrorType.none]: '',
    };

    if (erroTypes) {
      return errors[errorType];
    }

    return 'Error was occurred..';

    // switch (erroTypes) {
    //   case ErrorType.add:
    //     return 'Unable to add a todo';

    //   case ErrorType.update:
    //     return 'Unable to update a todo';

    //   case ErrorType.delete:
    //     return 'Unable to delete a todo';

    //   case ErrorType.empty:
    //     return 'Title can\'t be empty';

    //   case ErrorType.rename:
    //     return 'Title is not renamed';

    //   default:
    //     return 'Error';
    // }
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="Mute volume"
        className="delete"
        onClick={() => setHasError(false)}
      />
      {errorNotification(errorType)}
    </div>
  );
};
