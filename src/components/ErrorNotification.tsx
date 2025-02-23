import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean;
  setHasError: () => void;
  errors: {
    titleError: string;
    todosError: string;
    addError: string;
    deleteError: string;
    updateError: string;
  };
};

export const ErrorNotification: React.FC<Props> = ({
  hasError,
  setHasError,
  errors,
}) => (
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
      className="delete"
      onClick={setHasError}
    />
    {Object.values(errors)
      .filter(err => err)
      .map(error => (
        <React.Fragment key={error}>
          {error}
          <br />
        </React.Fragment>
      ))}
  </div>
);
